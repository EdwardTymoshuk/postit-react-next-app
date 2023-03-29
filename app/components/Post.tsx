'use client'

import Image from 'next/image'
import Link from 'next/link'
import { AiOutlineHeart, AiFillHeart } from 'react-icons/ai'
import { useState } from 'react'
import { EventType } from 'next-auth'

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
}[]
}

export default function Post({id, name, avatar, postTitle, comments}:PostType) {
  const [likesCounter, setLikesCounter] = useState(0)

  const setLike = (e:React.FormEvent) => {
    e.preventDefault()
    setLikesCounter(+1)
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
          <button onClick={setLike} className="flex items-center"><AiOutlineHeart />{likesCounter}</button>
        </div>
      </div>
    )
}