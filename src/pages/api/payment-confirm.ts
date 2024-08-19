import type { NextApiRequest, NextApiResponse } from 'next'
import { connectToDatabase } from '@/util/mongodb';
import { Db } from 'mongodb';
import { IOrder } from '@/types/cart/cart';

export default async function handler(req: NextApiRequest, res: NextApiResponse<{ status: 'error' | 'valid', description: string }>) {
    try {
        const { db }: { db: Db } = await connectToDatabase();
        console.log(req.query);
        const paymentSession = await db.collection<{ order: string, verficationToken: string }>("pending-payments").findOne({ order: req.query.order, verificationToken: req.query.verification_token });
        console.log(paymentSession);
        if (paymentSession) {
            await db.collection<IOrder>('orders').updateOne({ id: paymentSession.order }, { $set: { "payment.confirmed": true } });
            await db.collection<{ order: string, verficationToken: string }>("pending-payments").deleteOne({ _id: paymentSession._id });
        }
        res.status(200).redirect('/orders?highlight=' + paymentSession?.order);
    } catch (e: any) {
        return res.status(400).json({ status: 'error', description: 'Supplied invalid token: ' + e.message });
    }
}