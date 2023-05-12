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
  likes: {
    id: string,
    userId: string,
    postId: string
  }[],
  loginedUserId: string,
  createdAt: string
}

export default function Post({ id, name, avatar, postTitle, comments, likes, loginedUserId, createdAt }: PostType) {
  const queryClient = useQueryClient()
  const [isLikedSuccess, setIsLikedSuccess] = useState(false)

  let toastPostId: string

  const toggleLike = (e:React.FormEvent) => {
    if (likes.filter(like => like.userId === loginedUserId).length > 0) {
       removeLike(e)
    } else {
      addLike(e)
    }
  }

  useEffect(() => {
    likes.forEach(value => {
      !!loginedUserId && value.userId === loginedUserId && setIsLikedSuccess(true)
    })
  }, [likes])
  

  //create a post
  const addLikeMutate = useMutation(
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
  const removeLikeMutate = useMutation(
    async () => await axios.delete("/api/posts/removeLike", { data:id }),
    {
      onError: (error) => {
        error instanceof AxiosError &&
          toast.error(error?.response?.data.message, { id: toastPostId })
      },
      onSuccess: (data) => {
        toast.success("Like has been removed!", { id: toastPostId })
        queryClient.invalidateQueries(["posts"])
        setIsLikedSuccess(false)
      },
    }
  )


  const addLike = async (e: React.FormEvent) => {
    e.preventDefault()
    const button:HTMLElement = e.target as HTMLButtonElement
    if (button.classList.contains("liked")) {
      button.classList.remove("liked");
    } else {
      button.classList.add("liked");
    }
    toastPostId = toast.loading('Your like is adding...', { id: toastPostId })
    addLikeMutate.mutate()
  }

  const removeLike = async (e: React.FormEvent) => {
    e.preventDefault()
    toastPostId = toast.loading('Your like is removing...', { id: toastPostId })
    removeLikeMutate.mutate()
  } 


  return (
    <div className="bg-white my-8 p-8 rounded-lg">
      <div className="flex items-center justify-between">
        <div className="inline-flex items-center gap-2">
        <Image
          className="rounded-full"
          width={32}
          height={32}
          src={avatar}
          alt="avatar"
        />
        <h3 className="font-bold text-gray-700">{name}</h3>
        </div>
        <div className="text-gray-500 text-sm">
        <p>{createdAt?.split('T')[0]+' '+createdAt?.split('T')[1].split('.')[0]}</p>
        </div>
      </div>
      <div className="my-8">
        <p className="brake-all">{postTitle}</p>
      </div>
      <div className="flex gap-4 cursor-pointer items-center stage">
        <Link href={`/post/${id}`}>
          <p className="text-sm font-bold text-gray-700">
            {comments?.length} Comments
          </p>
        </Link>
        <button onClick={toggleLike} className="flex items-center heart">{!isLikedSuccess ? <AiOutlineHeart /> : <AiFillHeart color="red" />}{likes.length}</button>
      </div>
    </div>
  )
}