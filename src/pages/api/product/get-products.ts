import type { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from '@/util/mongodb';
import { Db } from 'mongodb';
import { IProduct } from "@/types/products/product";
import jwt from 'jsonwebtoken';

interface Parameters {
    sort?: "lowestToHighest" | "highestToLowest" | null | undefined,
    minPrice?: number | undefined | null,
    maxPrice?: number | undefined | null,
    category?: string,
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<{ status: 'error' | 'valid', description: string, items?: Array<IProduct> }>) {
    try {
        const { db }: { db: Db } = await connectToDatabase();

        // Get parameters from the request query
        const { sort, minPrice, maxPrice, category }: Parameters = req.body;

        // Check if both minPrice and maxPrice are provided and valid
        if ((minPrice !== undefined && maxPrice !== undefined) && (isNaN(minPrice) || isNaN(maxPrice))) {
            return res.status(400).json({ status: 'error', description: 'Invalid price range provided.' });
        }

        // Construct the query based on parameters
        const query: any = {};

        if (minPrice !== undefined && !isNaN(minPrice)) {
            query["price.value"] = { ...query["price.value"], $gte: minPrice };
        }

        if (maxPrice !== undefined && !isNaN(maxPrice)) {
            query["price.value"] = { ...query["price.value"], $lte: maxPrice };
        }
        if (category) {
            query["categories"] = category;
        }

        // You can add more conditions based on other parameters (sort, etc.) here

        // Fetch products based on the constructed query
        const products = await db.collection<IProduct>('products').find(query).limit(10).toArray();

        // Sort the products if a valid sorting option is provided
        if (sort && (sort === 'lowestToHighest' || sort === 'highestToLowest')) {
            products.sort((a, b) => {
                const aValue = a.price.value;
                const bValue = b.price.value;

                return sort === 'lowestToHighest' ? aValue - bValue : bValue - aValue;
            });
        }

        return res.status(200).json({ status: 'valid', description: 'Products found', items: products });
    } catch (error: any) {
        return res.status(400).json({ status: 'error', description: 'Error processing request: ' + error.message });
    }
}
