import type {NextApiRequest, NextApiResponse} from 'next'
import {getServerSession} from 'next-auth/next'
import {authOptions} from '../auth/[...nextauth]'
import prisma from '../../../prisma/client'

export default async function handler (
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method === 'POST') {
        const session = await getServerSession(req, res, authOptions)
        if (!session) return res.status(401).json({message: "Please sign in to make a post."})

        //get title
        const title: string = req.body.title

        //get user
        const prismaUser = await prisma.user.findUnique({
            where: {email: session?.user?.email}
        })

        //check title
        title.length > 300 && res.status(403).json({message: "Please write a shorter post."})
        !title.length && res.status(403).json({message: "Please don't leave it empty."})

        //create post
        try{
            const result = await prisma.post.create({
                data: {
                    title,
                    userId: prismaUser.id
                }
            })
            res.status(200).json(result)
        } catch (err){
            res.status(403).json({err: "Error was occured whilst maling a post."})
        }
    }
}