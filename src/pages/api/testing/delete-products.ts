import type { NextApiRequest, NextApiResponse } from 'next'
import { LoremIpsum } from "lorem-ipsum";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    // db
    return res.json("d")
}