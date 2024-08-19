import type { NextApiRequest, NextApiResponse } from 'next'
import { connectToDatabase } from '@/util/mongodb';
import { IUser, IUserTokenClaims } from '@/types/auth/user';
import { Db } from 'mongodb';

type Parameters = {
    email: string,
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<{ status: 'error' | 'valid', description: string }>) {
    const body = req.body as Parameters;
    if (!req.body || !body.email) return res.status(400).json({ status: 'error', description: 'Request body empty, make sure email & password is attached in the body' });
    const { db }: { db: Db } = await connectToDatabase();
    const user = await db.collection<IUser>("users").findOne({ email: body.email });
    if (!user) return res.status(400).json({ status: 'error', description: 'User was not found.' });
    res.status(200).json({status: 'valid', description: 'User found'});
}