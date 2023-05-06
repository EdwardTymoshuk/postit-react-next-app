import type {NextApiRequest, NextApiResponse} from 'next'
import {getServerSession} from 'next-auth/next'
import {authOptions} from './[...nextauth]'
import prisma from '../../../prisma/client'

export default async function handler (
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method === 'GET') {
        const session = await getServerSession(req, res, authOptions)
        if (!session) return res.json('')
        //fetch all posts
        try{
            const prismaUser = await prisma.user.findUnique({
                where:{ 
                    email: session?.user?.email
                }  
            })
            const data = prismaUser?.id
            res.status(200).json(data)
        } catch (err){
            res.status(403).json({err: "Error fetching user"})
        }
    }
}