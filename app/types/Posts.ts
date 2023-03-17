export type PostType = {
    title: string,
    id: string,
    createdAt: string,
    user: {
        id: string,
        name: string,
        image: string,
    },
    comments?: {
        createdAt: string,
        id: string,
        postId: string,
        userId: string
    }[]
}