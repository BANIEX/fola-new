import type { NextApiRequest, NextApiResponse } from 'next'
import { connectToDatabase } from '@/util/mongodb';
import { Db } from 'mongodb';
import { IProduct, IVariant, IOption, IProductPrice, IReview } from "@/types/products/product";
import { IUser, IUserTokenClaims } from '@/types/auth/user';
// import { v4 } from "uuid";
import jwt from 'jsonwebtoken';
import { getCookies, getCookie, setCookie, deleteCookie } from 'cookies-next';
// import { slugify } from '@/util/slugify';
// import { z } from 'zod';
// import { iProductSchemaZod } from '@/types/products/product.zod';

/**
 * Verify if the incoming data matches the specified TypeScript type.
 * @param data The data to verify.
 * @param type The TypeScript type to verify against.
 * @returns True if the data matches the type, false otherwise.
 */
function isValidType<T>(data: any, type: { new(...args: any[]): T }): data is T {
    try {
        const instance = new type(data);
        return true;
    } catch (error) {
        return false;
    }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<{ status: 'error' | 'valid', description: string }>) {
    const userJWT = getCookie('auth.user', { req, res });
    if (!userJWT) return res.status(400).json({ status: 'error', description: 'No token attached to request' });
    if (!process.env.NEXT_PUBLIC_JWT_PUBLIC_KEY) throw new Error("ECDSA Key does not exist?");
    const body = req.body as IReview;
    // if (!iProductSchemaZod.parse(body)) return res.status(400).json({ status: 'error', description: 'Request body empty, make sure atleast name & description is attached in the body' });
    try {
        const decoded = await jwt.verify(userJWT, Buffer.from(process.env.NEXT_PUBLIC_JWT_PUBLIC_KEY, 'base64').toString('utf8'), { algorithms: ['ES512'] }) as unknown as IUserTokenClaims;
        if (typeof decoded === "string") throw new Error("Token could not be decoded.");
        const { db }: { db: Db } = await connectToDatabase();
        const user = await db.collection<IUser>("users").findOne({ id: decoded.id });
        if (!user) return res.status(400).json({ status: 'error', description: 'User was not found.' });
        await db.collection<IReview>('reviews').updateOne({
            product_id: req.query.product_id?.toString() ?? '',
            author: user.id,
        }, {
            $set: {
                product_id: req.query.product_id?.toString() ?? '',
                author: user.id,
                rating: parseInt(req.query.rating?.toString() ?? '0')
            }
        }, { upsert: true });
        res.status(200).json({ status: 'valid', description: 'Product updated.' });
    } catch (e: any) {
        return res.status(400).json({ status: 'error', description: 'Supplied invalid token: ' + e.message });
    }
}