'use client'

import Post from "../../components/Post"
import {useQuery} from '@tanstack/react-query'
import axios from 'axios'
import { UrlProps } from "../../types/UrlProps"
import { PostProps } from "../../types/PostProps"
import AddComment from "../../components/AddComment"
import Image from "next/image"


const fetchDetails = async (slug:string) => {
    const response = await axios.get(`/api/posts/${slug}`)
    return response.data
}

export default function PostDetail(url:UrlProps) {
    const {data, isLoading} = useQuery<PostProps>({
        queryFn: () => fetchDetails(url.params.slug),
        queryKey: ['detail-post'],
    })
    if (isLoading) {return 'Loading...'}
    return (
      <div>
        <Post
          id={data?.id}
          name={data?.user.name}
          avatar={data?.user.image}
          postTitle={data?.title}
          comments={data?.comments}
        />
        <AddComment id={data?.id} /> 
        {data?.comments?.map(comment => (
          <div key={comment.id} className="my-6 bg-white p-8 rounded-md">
            <div className="flex item-center gap-2">
              <Image 
                width={24}
                height={24}
                src={comment.user?.image}
                alt="avatar"
              />
              <h3 className="font-bold">{comment.user?.name}</h3>
              <h2 className="text-sm">{comment.createdAt?.split('T')[0]}</h2>
            </div>
            <div className="py-4">{comment.message}</div>
          </div>
        ))}
      </div>
    )
}