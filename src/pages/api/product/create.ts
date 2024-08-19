import type { NextApiRequest, NextApiResponse } from 'next'
import { connectToDatabase } from '@/util/mongodb';
import { Db } from 'mongodb';
import { IProduct, IVariant, IOption, IProductPrice } from "@/types/products/product";
import { IUser, IUserTokenClaims } from '@/types/auth/user';
import { v4 } from "uuid";
import jwt from 'jsonwebtoken';
import { getCookies, getCookie, setCookie, deleteCookie } from 'cookies-next';
import { slugify } from '@/util/slugify';
const short = require('short-uuid');

interface Parameters {
    name: string,
    description: string,
    price: IProductPrice,
    variants: {
        default: string,
        items: Array<IVariant>
    },
    options: Array<IOption>,
}
export default async function handler(req: NextApiRequest, res: NextApiResponse<{ status: 'error' | 'valid', description: string }>) {
    const userJWT = getCookie('auth.user', { req, res });
    if (!userJWT) return res.status(400).json({ status: 'error', description: 'No token attached to request' });
    if (!process.env.NEXT_PUBLIC_JWT_PUBLIC_KEY) throw new Error("ECDSA Key does not exist?");
    const body = req.body as Parameters;
    if (!req.body || !body.name || !body.description) return res.status(400).json({ status: 'error', description: 'Request body empty, make sure atleast name & description is attached in the body' });
    try {
        const decoded = await jwt.verify(userJWT, Buffer.from(process.env.NEXT_PUBLIC_JWT_PUBLIC_KEY, 'base64').toString('utf8'), { algorithms: ['ES512'] }) as unknown as IUserTokenClaims;
        if (typeof decoded === "string") throw new Error("Token could not be decoded.");
        const { db }: { db: Db } = await connectToDatabase();
        const user = await db.collection<IUser>("users").findOne({ id: decoded.id });
        if (!user) return res.status(400).json({ status: 'error', description: 'User was not found.' });
        if (user.type !== "admin") return res.status(400).json({ status: 'error', description: 'User was not admin.' });
        const id: string = v4();
        const shortID: string = short.generate();
        await db.collection<IProduct>("products").insertOne({
            id: id,
            slug: `${slugify(body.name)}-${shortID}`,
            name: body.name,
            price: body.price,
            description: body.description,
            variants: body.variants,
            options: body.options,
            metadata: {
                ids: {
                    shortID: shortID
                },
                reviews: {
                    type: "embedded.disqus"
                },
                orders: {
                    count: 0,
                    lastUpdated: new Date(),
                }
            }
        });
        res.status(200).json({ status: 'valid', description: 'Product added.' });
    } catch (e: any) {
        return res.status(400).json({ status: 'error', description: 'Supplied invalid token: ' + e.message });
    }
}