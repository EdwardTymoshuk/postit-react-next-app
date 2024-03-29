import type {NextApiRequest, NextApiResponse} from 'next'
import prisma from '../../../prisma/client'

export default async function handler (
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method === 'GET') {
          try {
            const data = await prisma.post.findUnique({
                where: {
                    id: req.query.details as string
                },
                include: {
                    user: true,
                    comments: {
                        orderBy: {
                            createdAt: 'desc'
                        },
                        include: {
                            user: true
                        }
                    },
                    likes: true
                }
            })
            return res.status(200).json(data)
          } catch (err) {
            res
              .status(403)
              .json({ err: "Error was occured whilst maling a post." })
          }
        }
    }