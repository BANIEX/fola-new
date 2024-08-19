import type { NextApiRequest, NextApiResponse } from 'next'
import { connectToDatabase } from '@/util/mongodb';
import { IUser, IUserTokenClaims } from '@/types/auth/user';
import { Db } from 'mongodb';
import jwt from 'jsonwebtoken';
import { getCookies, getCookie, setCookie, deleteCookie } from 'cookies-next';
import { IOrder } from '@/types/cart/cart';


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
        const skip = req.query.skip ? parseInt(req.query.skip?.toString()) : 0;
        const limit = req.query.limit ? parseInt(req.query.limit?.toString()) : 30;
        const users = await db.collection<IOrder>("orders").aggregate([
            {
                $match: {}
            },
            {
                $lookup: {
                    from: "users",
                    localField: "owner",
                    foreignField: "id",
                    as: "user"
                }
            },
            {
                $unwind: "$user"
            }
        ]).limit(limit).skip(skip).toArray();
        res.status(200).json({ status: 'valid', description: 'Orders found', items: users, slice: [skip, limit] });
    } catch (e) {
        return res.status(400).json({ status: 'error', description: 'Error Authenticating' })
    }
}