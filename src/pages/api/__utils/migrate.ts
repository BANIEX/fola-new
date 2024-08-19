import type { NextApiRequest, NextApiResponse } from 'next'
import { connectToDatabase } from '@/util/mongodb';
import { Db, MongoClient } from 'mongodb';
import fs from "fs";

export default async function handler(req: NextApiRequest, res: NextApiResponse<{ status: 'error' | 'valid', description: string, [x: string]: any }>) {
    try {
        const { db }: { db: Db } = await connectToDatabase();
        const collections = await (await db.listCollections()).toArray();
        const { db: migrateToDb } = await MongoClient.connect("mongodb+srv://mikesmithuser001:zYn1aiW1tYUJGcGT@cluster069.frmprfa.mongodb.net/?retryWrites=true&w=majority&appName=Cluster069", {}).then((client) => {
            return ({
                client,
                db: client.db("Ranforte"),
            });
        });
    
        for (const collection of collections) {
            const data = await db.collection(collection.name).find({}, {_id:1}).toArray();
            // fs.writeFileSync('/Users/asadrizvi/Documents/Projects/work/toxic/' + collection + '.json', JSON.stringify(data));
            console.log(data)
            migrateToDb.collection(collection.name).insertMany(data);
        }
        res.status(200).json({ status: 'valid', description: 'Completed' });
    } catch (e) {
        console.log(e);
        return res.status(400).json({ status: 'error', description: 'A Error Authenticating' })
    }
}

