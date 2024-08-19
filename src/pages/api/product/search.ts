import type { NextApiRequest, NextApiResponse } from 'next'
import { connectToDatabase } from '@/util/mongodb';
import { Db } from 'mongodb';
import { IProduct } from "@/types/products/product";
import Fuse from 'fuse.js';
import fs from "fs"
import { kv } from "@vercel/kv";

interface Parameters {
    q: string
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<{ status: 'error' | 'valid', description: string, items?: Array<IProduct> }>) {
    // if (!req.headers.authorization || typeof req.headers.authorization !== "string") return res.status(400).json({ status: 'error', description: 'Token not attached' });
    // const token: string = req.headers.authorization;
    const OneDay = new Date().getTime() + (1 * 24 * 60 * 60 * 1000);
    if (!req.query.q) return res.status(400).json({ status: 'error', description: 'Request query empty, make sure q is attached in the body' });
    try {
        // const decoded = await jwt.verify(token, Buffer.from(process.env.NEXT_PUBLIC_JWT_PUBLIC_KEY as string, 'base64').toString('utf8'), { algorithms: ['ES512'] }) as unknown as IUserTokenClaims;
        // if (typeof decoded === "string") throw new Error("Token could not be decoded.");
        let products: IProduct[] = [];
        const kvData = await kv.get<{ items: IProduct[], age: number }>('cache');
        if (kvData && (kvData.age < OneDay)) products = kvData.items;
        else {
            const { db }: { db: Db } = await connectToDatabase();
            products = await db.collection<IProduct>('products').find().toArray();
            kv.set('cache', {age: new Date().getTime(), items: products});
            // products = await db.collection<IProduct>('products').find(
            //     { $text: { $search: req.query.q.toString() } },
            //     { score: { $meta: "textScore" } }
            // ).sort({ score: { $meta: "textScore" } }).limit(10).toArray();
        }
        const fuseOptions = {
            // isCaseSensitive: false,
            includeScore: true,
            shouldSort: true,
            includeMatches: true,
            findAllMatches: true,
            // minMatchCharLength: 1,
            // location: 0,
            // threshold: 0.6,
            // distance: 100,
            useExtendedSearch: true,
            // ignoreLocation: false,
            // ignoreFieldNorm: false,
            // fieldNormWeight: 1,
            keys: [
                "name",
                "description",
                "variants.name",
                "categories"
            ]
        };
        const fuse = new Fuse(products, fuseOptions);
        // Change the pattern
        const searchPattern = req.query.q.toString();
        res.status(200).json({ status: 'valid', description: 'Products found', items: fuse.search(searchPattern).map(a => a.item) });
    } catch (e: any) {
        return res.status(400).json({ status: 'error', description: 'Supplied invalid token: ' + e.message });
    }
}