import type { NextApiRequest, NextApiResponse } from 'next'
import { connectToDatabase } from '@/util/mongodb';
import { Db } from 'mongodb';
import { IProductCartItem } from "@/types/products/product";
import { IUser, IUserTokenClaims } from '@/types/auth/user';
import { v4 } from "uuid";
import jwt from 'jsonwebtoken';
import { ICart, IOrder } from '@/types/cart/cart';
import { getCookie } from 'cookies-next';
import mozjexl from 'mozjexl';
import { ICartExtended } from '@/pages/cart';

type Parameters = {
    cart: string // Cart ID,
    address: string,
    postalCode: number,
    phone: number

};
export default async function handler(req: NextApiRequest, res: NextApiResponse<{ status: 'error' | 'valid', description: string, [x: string]: any }>) {
    const userJWT = getCookie('auth.user', { req, res });
    if (!userJWT) return res.status(400).json({ status: 'error', description: 'No token attached to request' });
    if (!process.env.NEXT_PUBLIC_JWT_PUBLIC_KEY) throw new Error("ECDSA Key does not exist?");
    const body = req.body as Parameters;
    if (!req.body) return res.status(400).json({ status: 'error', description: 'Request body empty, make sure atleast id & variant is attached in the body' });
    try {
        const decoded = await jwt.verify(userJWT, Buffer.from(process.env.NEXT_PUBLIC_JWT_PUBLIC_KEY, 'base64').toString('utf8'), { algorithms: ['ES512'] }) as unknown as IUserTokenClaims;
        if (typeof decoded === "string") throw new Error("Token could not be decoded.");

        const { db }: { db: Db } = await connectToDatabase();
        const user = await db.collection<IUser>("users").findOne({ id: decoded.id });
        if (!user) return res.status(400).json({ status: 'error', description: 'User was not found.' });
        const id: string = v4(); // Updates Cart:id
        const cart = (await db.collection<ICart>("cart").aggregate([
            {
                $match: { owner: (user.id) }
            },
            {
                $unwind: "$items" // Unwind the items array to work with individual items
            },
            {
                $lookup: {
                    from: "products",
                    localField: "items.id",
                    foreignField: "id",
                    as: "product"
                }
            },
            {
                $unwind: "$product" // Unwind the product array to work with individual product documents
            },
            {
                $group: {
                    _id: "$_id",
                    owner: { $first: "$owner" },
                    createdAt: { $first: "$createdAt" },
                    id: { $first: "$id" },
                    modifiedAt: { $first: "$modifiedAt" },
                    items: {
                        $push: {
                            id: "$items.id",
                            configuration: "$items.configuration",
                            product: "$product" // Attach the product details to each item
                        }
                    }
                }
            },
            {
                $project: {
                    _id: 1,
                    owner: 1,
                    createdAt: 1,
                    id: 1,
                    modifiedAt: 1,
                    items: 1
                }
            }
        ]).toArray())?.[0] as ICartExtended;
        if (!cart) return res.status(400).json({ status: 'error', description: 'Cart not found' });
        cart['total'] = 0;
        for (const item of cart.items) {
            item['total'] = item.product?.price.value;
            const variant = item.product?.variants.items.find(({ id }) => id === item.configuration.variant.id);
            const options = item.product?.options.filter(({ id }) => item.configuration.options.findIndex(({ id: _id }) => _id === id) === -1) ?? [];
            console.log(await mozjexl.eval(variant?.priceModifier, { product: item.product, variant }))
            item['total'] += parseFloat(await mozjexl.eval(variant?.priceModifier, { product: item.product, variant }).catch(() => (0)));
            for (const option of options) {
                console.log(option);
                item['total'] += parseFloat(await mozjexl.eval(option?.option.priceModifier, {
                    product: item.product, variant, selection: {
                        index: option?.option?.options.findIndex((value: string | number) => value === item.configuration.options.find(({ id }) => id === option.id)?.value),
                    }
                }).catch(() => (0)));
            }
            cart['total'] += item['total'];
        }
        await db.collection<IOrder>("orders").insertOne({
            id, createdAt: new Date(), modifiedAt: new Date(),
            owner: user.id, // Owner userId
            items: cart.items,
            billing: {
                address: body.address,
                postalCode: body.postalCode
            },
            total: cart['total'],
            payment: {
                confirmed: false,
                type: "cod"
            },
            status: "recieved",
        });
        await db.collection<ICart>("cart").updateOne({ owner: user.id }, {
            $set: {
                items: [],
            }
        });
        res.status(200).json({ status: 'valid', description: 'Products ordered', id });
    } catch (e: any) {
        console.error(e)
        return res.status(400).json({ status: 'error', description: 'Supplied invalid token: ' + e.message });
    }
}