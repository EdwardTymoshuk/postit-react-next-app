'use client'

import Post from "../../components/Post"
import {useQuery} from '@tanstack/react-query'
import axios from 'axios'
import { UrlProps } from "../../types/UrlProps"
import { PostProps } from "../../types/PostType"
import AddComment from "../../components/AddComment"
import Image from "next/image"
import { ThreeDots } from "react-loader-spinner"


const fetchDetails = async (slug:string) => {
    const response = await axios.get(`/api/posts/${slug}`)
    const loginedUserId = await axios.get('/api/auth/getLoginedUser')
    return Object.assign(response.data, {'loginedUserId': loginedUserId.data})
}

export default function PostDetail(url:UrlProps) {
    const {data, isLoading} = useQuery<PostProps>({
        queryFn: () => fetchDetails(url.params.slug),
        queryKey: ['detail-post'],
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
        <Post
          id={data?.id!}
          name={data?.user.name!}
          avatar={data?.user.image!}
          postTitle={data?.title!}
          comments={data?.comments!}
          likes={data?.likes!}
          loginedUserId={data?.loginedUserId!}
          createdAt={data?.createdAt!}
        />
        <AddComment id={data?.id} /> 
        {data?.comments?.map(comment => (
          <div key={comment.id} className="my-6 bg-white p-8 rounded-md">
            <div className="flex item-center justify-between">
            <div className="inline-flex items-center gap-2">
              <Image 
                className="rounded-full"
                width={24}
                height={24}
                src={comment.user?.image}
                alt="avatar"
              />
              <h3 className="font-bold">{comment.user?.name}</h3>
              </div>
              <div className="text-gray-500 text-sm">
              <h2 className="text-sm">{comment.createdAt?.split('T')[0]+' '+comment.createdAt?.split('T')[1].split('.')[0]}</h2>
            </div>
            </div>
            <div className="py-4">{comment.message}</div>
          </div>
        ))}
      </div>
    )
}