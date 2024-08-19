import type { NextApiRequest, NextApiResponse } from 'next'
import { connectToDatabase } from '@/util/mongodb';
import { IUser, IUserTokenClaims } from '@/types/auth/user';
import { Db } from 'mongodb';
import jwt from 'jsonwebtoken';
import { getCookies, getCookie, setCookie, deleteCookie } from 'cookies-next';

const { BetaAnalyticsDataClient } = require('@google-analytics/data');
const analyticsDataClient = new BetaAnalyticsDataClient();
const generateReport = async () => {
    const [response] = await analyticsDataClient.runRealtimeReport({
        property: `properties/431289205`,
        dateRanges: [
            {
                startDate: '2020-03-31',
                endDate: 'today',
            },
        ],
        dimensions: [{ name: 'eventName' }],
        metrics: [{ name: 'eventCount' }],

        dimensionFilters: [{
            fieldName: 'eventName',
            stringFilter: {
                value: 'product_view',
                matchType: 'EXACT',
            },
        }, {
            fieldName: 'page_path',
            stringFilter: {
                value: '4272c067-5fc9-4f30-b967-702c8c4dbf1f', //'e19b4d60-1821-45b3-a8ad-1b33cce9bcc0',
                matchType: 'EXACT',
            },
        }],
        // orderBys: [{ fieldName: 'totalEvents', sortOrder: 'DESCENDING' }]
    });
    return response;
}
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

        const report = await generateReport();
        res.status(200).json({ status: 'valid', description: 'Query run successfully. ', report });
    } catch (e: Error) {
        console.log(e);
        return res.status(400).json({ status: 'error', description: e.message ?? 'Error Authenticating. ' })
    }
}