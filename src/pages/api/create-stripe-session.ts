import { IOrder } from "@/types/cart/cart";
import type { NextApiRequest, NextApiResponse } from 'next'
import { connectToDatabase } from '@/util/mongodb';
import { Db } from 'mongodb';
import { IVariant, IOption, IProductPrice, IProductCartItem } from "@/types/products/product";
import { IUser, IUserTokenClaims } from '@/types/auth/user';
import jwt from 'jsonwebtoken';
import { getCookie } from 'cookies-next';
import { StripTags } from "../product/[slug]";
const short = require('short-uuid');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

interface Parameters {
    id: string, // Order id
}
export default async function handler(req: NextApiRequest, res: NextApiResponse<{ status: 'error' | 'valid', description: string, id?: string }>) {
    const userJWT = getCookie('auth.user', { req, res });
    if (!userJWT) return res.status(400).json({ status: 'error', description: 'No token attached to request' });
    if (!process.env.NEXT_PUBLIC_JWT_PUBLIC_KEY) throw new Error("ECDSA Key does not exist?");
    const body = req.body as Parameters;
    if (!req.body || !body.id) return res.status(400).json({ status: 'error', description: 'Request body empty, make sure atleast id is attached in the body' });
    try {
        const decoded = await jwt.verify(userJWT, Buffer.from(process.env.NEXT_PUBLIC_JWT_PUBLIC_KEY, 'base64').toString('utf8'), { algorithms: ['ES512'] }) as unknown as IUserTokenClaims;
        if (typeof decoded === "string") throw new Error("Token could not be decoded.");
        const { db }: { db: Db } = await connectToDatabase();
        const user = await db.collection<IUser>("users").findOne({ id: decoded.id });
        if (!user) return res.status(400).json({ status: 'error', description: 'User was not found.' });
        const redirectURL =
            process.env.NODE_ENV === 'development'
                ? 'http://localhost:3000/'
                : 'https://ranforte-eight.vercel.app/';

        const verificationToken: string = short.generate();
        const order = await db.collection<IOrder>("orders").findOne({ owner: user.id, id: req.body.id, "payment.confirmed": false });
        if (!order) return res.status(400).json({status: 'error', description: 'Order not found'});
        await db.collection('pending-payments').insertOne({ order: order?.id, verificationToken });
        const transformedItems = order?.items.map((item: IProductCartItem) => ({
            price_data: {
                currency: process.env.NEXT_PUBLIC_CURRENCY_CODE?.toString() ?? "",
                unit_amount: (item.total.toFixed(2)) * 100,
                product_data: {
                    images: item.product?.variants.items.find(({ id }) => id === item.configuration.variant.id)?.images.map(({ src }) => encodeURIComponent(src)),//.join(),
                    name: item.product?.name + ' - ' + item.product?.variants.items.find(({ id }) => id === item.configuration.variant.id)?.name,
                    description: StripTags(item.product?.description),
                },
            },
            quantity: 1,
        })) ?? [];
        /**
         * df['priority'] = Empty Series
         * df['job-title'] = [...]
         * ex.perform(on=df['priority'], df['job-title'], q="return priority scores, (high, low, medium) based on job-title, students should be rated low, and ceos high and so on")
         * >>processes query
         * df['priority'] = [...] # Series of high, low, and medium
         */
        // console.log(JSON.stringify({
        //     payment_method_types: ['card'],
        //     line_items: transformedItems,
        //     mode: 'payment',
        //     success_url: redirectURL + '?status=success',
        //     cancel_url: redirectURL + '?status=cancel',
        //     // metadata: {
        //     //     images: order?.items[0].product?.variants.items[0]?.images.map(({ src }) => src).join()
        //     // },
        // }))
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: transformedItems,
            mode: 'payment',
            success_url: redirectURL + `/api/payment-confirm?status=success&order=${order?.id}&verification_token=${verificationToken}`,
            cancel_url: redirectURL + '/orders?status=cancel&highlight=' + order?.id,
           
        });
        res.status(200).json({ status: 'valid', description: 'Stripe session created', id: session.id });
    } catch (e: any) {
        return res.status(400).json({ status: 'error', description: 'Supplied invalid token: ' + e.message });
    }
}
