'use client'

import AddPost from './components/AddPost'
import axios from 'axios'
import { useQuery } from '@tanstack/react-query'
import Post from './components/Post'
import {PostType} from './types/Posts'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import Loading from './components/Loading'




const allPosts = async () => {
  const loginedUserId = await axios.get('api/auth/getLoginedUser').then(res => res.data)
  const response = await axios.get('api/posts/getPosts')
  const data = response.data.map(el => Object.assign(el, {'loginedUserId': loginedUserId}))
  return data
}

export default function Home() {
  const {data, error, isLoading} = useQuery<PostType[]>({
    queryFn: allPosts,
    queryKey: ['posts']
  })
if (isLoading) return <Loading />

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
        />
      ))}
    </main>
  )
      }
