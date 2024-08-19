import { IOrder } from "@/types/cart/cart";
import type { NextApiRequest, NextApiResponse } from 'next'
import { connectToDatabase } from '@/util/mongodb';
import { Db } from 'mongodb';
import { IVariant, IOption, IProductPrice } from "@/types/products/product";
import { IUser, IUserTokenClaims } from '@/types/auth/user';
import jwt from 'jsonwebtoken';
import { getCookie } from 'cookies-next';

interface Parameters {
    id: string, // Order id
}
export default async function handler(req: NextApiRequest, res: NextApiResponse<{ status: 'error' | 'valid', description: string, order?: IOrder }>) {
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
        if (user.type !== "admin") return res.status(400).json({ status: 'error', description: 'User was not admin.' });
        const order = await db.collection<IOrder>('orders').findOne({id: req.body.id});
        if (!order) return res.status(400).json({ status: 'error', description: 'Order not found.' });
        res.status(200).json({ status: 'valid', description: 'Order found', order});
    } catch (e: any) {
        return res.status(400).json({ status: 'error', description: 'Supplied invalid token: ' + e.message });
    }
}

    // const { isOpen, onOpen, onOpenChange } = useDisclosure();
