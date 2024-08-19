import type { NextApiRequest, NextApiResponse } from 'next'
import { connectToDatabase } from '@/util/mongodb';
import { Db } from 'mongodb';
import { IUser, IUserTokenClaims } from '@/types/auth/user';
import jwt from 'jsonwebtoken';
import { ICart } from '@/types/cart/cart';
import { getCookie } from 'cookies-next';

export default async function handler(req: NextApiRequest, res: NextApiResponse<{ status: 'error' | 'valid', cart?: object | null, description: string }>) {
    const userJWT = getCookie('auth.user', { req, res });
    if (!userJWT) return res.status(400).json({ status: 'error', description: 'No token attached to request' });
    if (!process.env.NEXT_PUBLIC_JWT_PUBLIC_KEY) throw new Error("ECDSA Key does not exist?");
    try {
        const decoded = await jwt.verify(userJWT, Buffer.from(process.env.NEXT_PUBLIC_JWT_PUBLIC_KEY, 'base64').toString('utf8'), { algorithms: ['ES512'] }) as unknown as IUserTokenClaims;
        if (typeof decoded === "string") throw new Error("Token could not be decoded.");

        const { db }: { db: Db } = await connectToDatabase();
        const user = await db.collection<IUser>("users").findOne({ id: decoded.id });
        if (!user) return res.status(400).json({ status: 'error', description: 'User was not found.' });
        const cart = await db.collection<ICart>("cart").aggregate([
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
        ]).toArray();
        res.status(200).json({ status: 'valid', description: 'Cart found successfully', cart });
    } catch (e: any) {
        return res.status(400).json({ status: 'error', description: 'Supplied invalid token: ' + e.message });
    }
}