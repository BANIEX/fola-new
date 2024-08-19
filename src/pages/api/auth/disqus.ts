import type { NextApiRequest, NextApiResponse } from 'next'
import { connectToDatabase } from '@/util/mongodb';
import { IUser, IUserTokenClaims } from '@/types/auth/user';
import { Db } from 'mongodb';
import jwt from 'jsonwebtoken';
import { getCookies, getCookie, setCookie, deleteCookie } from 'cookies-next';

const CryptoJS = require('crypto-js');

type Parameters = {
}
function disqusSignon(user: IUser) {
    var disqusData = {
      id: user.id,
      username: user.username,
      email: user.email,
      // optional 
    //   avatar: user.avatar,
    //   url: user.url,
    //   profile_url: user.profile_url
    };
  
    
    // Pass an empty JSON object to generate payload that logs out user with client-side DISQUS.reset()
    var disqusNullData = ({});

    var disqusStr = JSON.stringify(disqusData);
    var timestamp = Math.round(+new Date() / 1000);

    /*
     * Note that `Buffer` is part of node.js
     * For pure Javascript or client-side methods of
     * converting to base64, refer to this link:
     * http://stackoverflow.com/questions/246801/how-can-you-encode-a-string-to-base64-in-javascript
     */
    var message = new Buffer(disqusStr).toString('base64');

    /* 
     * CryptoJS is required for hashing (included in dir)
     * https://code.google.com/p/crypto-js/
     */

    var result = CryptoJS.HmacSHA1(message + " " + timestamp, process.env.DISQUS_SECRET_KEY);
    var hexsig = CryptoJS.enc.Hex.stringify(result);

    return {
      pubKey: process.env.NEXT_PUBLIC_DISQUS_PUBLIC_KEY,
      auth: message + " " + hexsig + " " + timestamp,
      test: "testing-field.ranforte"
    };
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<{ status?: 'error' | 'valid', description?: string, [x: string]: any }>) {
    console.log('disqus auth called')
    const userJWT = getCookie('auth.user', { req, res });
    if (!userJWT) return res.redirect('/auth/login?r=/api/auth/disqus');
    // res.status(400).json({ status: 'error', description: 'No token attached to request' });
    if (!process.env.NEXT_PUBLIC_JWT_PUBLIC_KEY) throw new Error("ECDSA Key does not exist?");
    try {
        const decoded = await jwt.verify(userJWT, Buffer.from(process.env.NEXT_PUBLIC_JWT_PUBLIC_KEY, 'base64').toString('utf8'), { algorithms: ['ES512'] }) as unknown as IUserTokenClaims;
        if (typeof decoded === "string") throw new Error("Token could not be decoded.");
        const { db }: { db: Db } = await connectToDatabase();
        const user = await db.collection<IUser>("users").findOne({ id: decoded.id });
        if (!user) return res.redirect('/auth/login?r=/api/auth/disqus');
        // res.status(400).json({status: 'error', description: 'User was not found.'});
        res.status(200).json(disqusSignon(user));
    } catch (e: any) {
        return res.status(400).json({ status: 'error', description: 'Supplied invalid token: ' + e.message });
    }
}