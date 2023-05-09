'use client'

import AddPost from './components/AddPost'
import axios from 'axios'
import { useQuery } from '@tanstack/react-query'
import Post from './components/Post'
import { ThreeDots } from 'react-loader-spinner'
import { PostProps } from './types/PostType'




const allPosts = async () => {
  const loginedUserId = await axios.get('api/auth/getLoginedUser').then(res => res.data)
  const response = await axios.get('api/posts/getPosts')
  const data = response.data.map(el => Object.assign(el, { 'loginedUserId': loginedUserId }))
  return data
}

export default function Home() {
  const { data, error, isLoading } = useQuery<PostProps[]>({
    queryFn: allPosts,
    queryKey: ['posts']
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
    <main>
      <AddPost />
      {data?.map((post) => (
        <Post
          key={post.id}
          name={post.user.name}
          avatar={post.user.image}
          postTitle={post.title}
          id={post.id}
          comments={post.comments}
          likes={post.likes}
          loginedUserId={post.loginedUserId}
          createdAt={post.createdAt}
        />
      ))}
    </main>
  )
}
