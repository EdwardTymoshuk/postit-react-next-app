export type PostProps = {
    title: string,
    id: string,
    updatedAt?: string,
    user: {
        email: string,
        id: string,
        name: string,
        image: string,
    },
    comments?: {
        createdAt?: string,
        id: string,
        postId: string,
        userId: string,
        message: string,
        user: {
            email: string,
            id: string,
            name: string,
            image: string,
        }
    }[],
    likes?: [],
    loginedUserId: string
}