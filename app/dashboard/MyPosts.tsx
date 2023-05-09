'use client'

import {useQuery} from '@tanstack/react-query'
import axios from 'axios'
import { ThreeDots } from 'react-loader-spinner'
import { AuthPosts } from '../types/AuthPosts'
import EditPost from './EditPost'

const fetchAuthPosts = async () => {
    const response = await axios.get('/api/posts/authPosts')
    return response.data
}

export default function MyPosts() {
    const {data, isLoading} = useQuery<AuthPosts>({
        queryFn: fetchAuthPosts,
        queryKey: ['auth-posts']
    })
    if (isLoading) return <ThreeDots
    height="80"
    width="80"
    radius="9"
    color="#0d9488"
    ariaLabel="three-dots-loading"
    wrapperStyle={{}}
    wrapperClass="justify-center"
    visible={true}
  />
    return (
        <div>
            {!!data ? data.posts.map((post) => <EditPost id={post.id} key={post.id} avatar={data.image} name={data.name} title={post.title} comments={post.comments} />) :
                    <h1>You don't have any posts yet 😔</h1>}
        </div>
    )
}