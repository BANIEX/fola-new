import type { NextApiRequest, NextApiResponse } from 'next'
import { connectToDatabase } from '@/util/mongodb';
import { Db } from 'mongodb';
import { IReview } from "@/types/products/product";

interface Parameters {
    q: string
}
export default async function handler(req: NextApiRequest, res: NextApiResponse<{ status: 'error' | 'valid', description: string, items?: Array<IReview>, average?: number }>) {
    if (!req.query.product) return res.status(400).json({ status: 'error', description: 'Request query empty, make sure product is attached in the body' });
    try {
        const { db }: { db: Db } = await connectToDatabase();
        const reviews = await db.collection<IReview>('reviews').find({ product_id: req.query.product }).toArray();
        res.status(200).json({ status: 'valid', description: 'Reviews found', items: reviews, average: reviews.reduce((sum, review) => sum + review.rating, 0) / (reviews.length || 1) });
    } catch (e: any) {
        return res.status(400).json({ status: 'error', description: 'Supplied invalid token: ' + e.message });
    }
}