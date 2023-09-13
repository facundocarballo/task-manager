import { db } from '@vercel/postgres';
import { NextApiRequest, NextApiResponse } from 'next';
 
export default async function handler(request: NextApiRequest, response: NextApiResponse) {
    if (request.method != 'GET') {
        response.status(405).json({ message: 'To use this method you have to call it as a GET METHOD.' });
    }
    const client = await db.connect();
    try {
        const {username} = request.query;
        if (Array.isArray(username)) {
            return response.status(500).json({ error: "You have to provide a username like this. https://localhost:3000/api/get/user?username=facundocarballo" })
        }

        const user = await client.sql`SELECT * FROM public.User WHERE username = ${username};`;
        
        return response.status(200).json({ user });
    } catch (error) {
        return response.status(500).json({ error });
    }
    
}