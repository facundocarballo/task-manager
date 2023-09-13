import { db } from '@vercel/postgres';
import { NextApiRequest, NextApiResponse } from 'next';
 
export default async function handler(request: NextApiRequest, response: NextApiResponse) {
  const client = await db.connect();
 
  try {
    await client.sql`CREATE TABLE IF NOT EXISTS "User" (
      id SERIAL PRIMARY KEY,
      username VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      password VARCHAR(255) NOT NULL
    );`;
  } catch (error) {
    return response.status(500).json({ error });
  }
 
  const users = await client.sql`SELECT * FROM User;`;
  return response.status(200).json({ users: users.rows });
}