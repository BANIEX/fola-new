import type { NextApiRequest, NextApiResponse } from 'next'
import { connectToDatabase } from '@/util/mongodb';
import { IUser, IUserTokenClaims } from '@/types/auth/user';
import { Db } from 'mongodb';
import jwt from 'jsonwebtoken';
import { getCookies, getCookie, setCookie, deleteCookie } from 'cookies-next';
import { ICart } from '@/types/cart/cart';

export default async function handler(req: NextApiRequest, res: NextApiResponse<IUser | { status: 'error' | 'valid', description: string, [x: string]: any }>) {
    const userJWT = getCookie('auth.user', { req, res });
    if (!userJWT) return res.status(400).json({ status: 'error', description: 'No token attached to request' });
    if (!process.env.NEXT_PUBLIC_JWT_PUBLIC_KEY) throw new Error("ECDSA Key does not exist?");
    try {
        const decoded = await jwt.verify(userJWT, Buffer.from(process.env.NEXT_PUBLIC_JWT_PUBLIC_KEY, 'base64').toString('utf8'), { algorithms: ['ES512'] }) as unknown as IUserTokenClaims;
        if (typeof decoded === "string") throw new Error("Token could not be decoded.");
        const { db }: { db: Db } = await connectToDatabase();
        const user = await db.collection<IUser>("users").findOne({ id: decoded.id });
        if (!user) return res.status(400).json({ status: 'error', description: 'User was not found.' });
        if (user.type !== "admin") return res.status(400).json({ status: 'error', description: 'User was not admin.' });
        const countCarts = await db.collection<ICart>("cart").count({});
        const countPurchases = await db.collection<ICart>("purchases").count({});
        res.status(200).json({ status: 'valid', description: 'Found cart abandonment percentage', carts: countCarts, purchases: countPurchases, percentage: ((countCarts / countPurchases === 0 ? 1 : countPurchases) || 1) * 100 });
    } catch (e) {
        return res.status(400).json({ status: 'error', description: 'Error Authenticating' })
    }
}