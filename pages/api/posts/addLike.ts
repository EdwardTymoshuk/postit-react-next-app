import type {NextApiRequest, NextApiResponse} from 'next'
import {getServerSession} from 'next-auth/next'
import {authOptions} from '../auth/[...nextauth]'
import prisma from '../../../prisma/client'

export default async function handler (
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method === "POST") {
        const session = await getServerSession(req, res, authOptions)
        const postId = req.body.id

        if (!session) return res.status(401).json({message: "Please sign in to like a post."})
        //Get a user
        const prismaUser = await prisma.user.findUnique({
            where:{ 
                email: session?.user?.email
            }  
        })
        const userId = prismaUser?.id
        //Add like
          try {
            const result = await prisma.like.create({
              data: {
                id: `${userId}_${postId}`,
                userId,
                postId 
              }
            })
            res.status(200).json(result)
          } catch (err) {
            res.status(403).json({ message: "Error was occured whilst adding like." })
          }
        }
    }