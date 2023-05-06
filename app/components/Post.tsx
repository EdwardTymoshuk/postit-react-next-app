'use client'

import Image from 'next/image'
import Link from 'next/link'
import { AiOutlineHeart, AiFillHeart } from 'react-icons/ai'
import { useEffect, useState } from 'react'
import axios, { AxiosError } from 'axios'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-hot-toast'

type PostType = {
  id: string,
  name: string,
  avatar: string,
  postTitle: string,
  comments: {
    createdAt: string,
    id: string,
    postId: string,
    userId: string
  }[],
  likes: [],
  loginedUserId: string
}

export default function Post({ id, name, avatar, postTitle, comments, likes, loginedUserId }: PostType) {
  const queryClient = useQueryClient()
  const [isLikedSuccess, setIsLikedSuccess] = useState(false)
  const [likesCounter, setLikesCounter] = useState(0)

  // useEffect(() => {

  //   loginedUserId !== '' && setIsLikedSuccess(true) 
  // })

  useEffect(() => {
    setLikesCounter(likes.length)
    likes.forEach(value => {
      !!loginedUserId && value.userId === loginedUserId && setIsLikedSuccess(true)
    })
    console.log('2 useef')
  }, [likes])
  


  let toastPostId: string

  //create a post
  const { mutate } = useMutation(
    async () => await axios.post("/api/posts/addLike", { id }),
    {
      onError: (error) => {
        error instanceof AxiosError &&
          toast.error(error?.response?.data.message, { id: toastPostId })
      },
      onSuccess: (data) => {
        toast.success("Like has been added!", { id: toastPostId })
        queryClient.invalidateQueries(["posts"])
        setIsLikedSuccess(true)
      },
    }
  )


  const addLike = async (e: React.FormEvent) => {
    e.preventDefault()
    toastPostId = toast.loading('Your like is adding...', { id: toastPostId })
    mutate(likes)
  }


  return (
    <div className="bg-white my-8 p-8 rounded-lg">
      <div className="flex item-center gap-2">
        <Image
          className="rounded-full"
          width={32}
          height={32}
          src={avatar}
          alt="avatar"
        />
        <h3 className="font-bold text-gray-700">{name}</h3>
      </div>
      <div className="my-8">
        <p className="brake-all">{postTitle}</p>
      </div>
      <div className="flex gap-4 cursor-pointer items-center">
        <Link href={`/post/${id}`}>
          <p className="text-sm font-bold text-gray-700">
            {comments?.length} Comments
          </p>
        </Link>
        <button onClick={addLike} className="flex items-center">{!isLikedSuccess ? <AiOutlineHeart /> : <AiFillHeart color="red" />}{likesCounter}</button>
      </div>
    </div>
  )
}