import { db } from '@vercel/postgres';
import { NextApiRequest, NextApiResponse } from 'next';
 
export default async function handler(request: NextApiRequest, response: NextApiResponse) {
    if (request.method != 'POST') {
        response.status(405).json({ message: 'To use this method you have to call it as a POST METHOD.' });
    }

    const client = await db.connect();
    
    try {
        const {username, email, password} = request.body;
        const res = await client.sql`INSERT INTO 
        "User" (username, email, password) 
        VALUES (${username}, ${email}, ${password});`;
        console.log("RES: ", res)
    } catch (error) {
        return response.status(500).json({ error });
    }
    
    return response.status(200).json({ message: "POST REQUEST SUCCESSFULY :)" });
}