import type { NextApiRequest, NextApiResponse } from 'next'
import { connectToDatabase } from '@/util/mongodb';
import { Db } from 'mongodb';
import { IProductCartItem } from "@/types/products/product";
import { IUser, IUserTokenClaims } from '@/types/auth/user';
import { v4 } from "uuid";
import jwt from 'jsonwebtoken';
import { ICart } from '@/types/cart/cart';
import { getCookie } from 'cookies-next';

type Parameters = {
    index: number
};
export default async function handler(req: NextApiRequest, res: NextApiResponse<{ status: 'error' | 'valid', description: string }>) {
    const userJWT = getCookie('auth.user', { req, res });
    if (!userJWT) return res.status(400).json({ status: 'error', description: 'No token attached to request' });
    if (!process.env.NEXT_PUBLIC_JWT_PUBLIC_KEY) throw new Error("ECDSA Key does not exist?");
    const body = req.body as Parameters;
    if (!req.body || body.index === null || body.index === undefined) return res.status(400).json({ status: 'error', description: 'Request body empty, make sure atleast index is attached in the body' });
    try {
        const decoded = await jwt.verify(userJWT, Buffer.from(process.env.NEXT_PUBLIC_JWT_PUBLIC_KEY, 'base64').toString('utf8'), { algorithms: ['ES512'] }) as unknown as IUserTokenClaims;
        if (typeof decoded === "string") throw new Error("Token could not be decoded.");

        const { db }: { db: Db } = await connectToDatabase();
        const user = await db.collection<IUser>("users").findOne({ id: decoded.id });
        if (!user) return res.status(400).json({ status: 'error', description: 'User was not found.' });

        await db.collection<ICart>("cart").bulkWrite([
            {
                updateOne: {
                    filter: { owner: user.id }, update: {
                        $unset: { [`items.${body.index}`]: 1 }, // Set the value at the specified index to null
                    }
                }
            },
            {
                updateOne: {
                    filter: { owner: user.id }, update: {
                        $pull: { items: null }, // Set the value at the specified index to null
                    }
                }
            },
        ]);
        res.status(200).json({ status: 'valid', description: 'Product removed to cart.' });
    } catch (e: any) {
        return res.status(400).json({ status: 'error', description: 'Supplied invalid token: ' + e.message });
    }
}