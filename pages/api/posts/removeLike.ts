import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]'
import prisma from '../../../prisma/client'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "DELETE") {
    const session = await getServerSession(req, res, authOptions)
    if (!session) return res.status(401).json({ message: "Please sign in to unlike a post." })
    //Get a current user
    const prismaUser = await prisma.user.findUnique({
      where: {
        email: session?.user?.email
      }
    })
    const userId = prismaUser?.id
    //Get a like
    const prismaLike = await prisma.like.findUnique({
      where: {
        id: `${userId}_${req.body}`
      }
    })

    try {
      const result = await prisma.like.delete({
        where: {
          id: prismaLike?.id
        }
      })
      res.status(200).json(result)
    } catch (err) {
      res.status(403).json({ message: "Error was occured whilst adding like." })
    }

  }
}