'use client'

import { useState } from 'react'
import {useMutation, useQueryClient} from '@tanstack/react-query'
import axios, { AxiosError } from 'axios'
import toast from 'react-hot-toast'

export default function AddPost() {
  const [title, setTitle] = useState("")
  const [isDisabled, setIsDisabled] = useState(false)
  const queryClient = useQueryClient()

  let toastPostId: string

  //create a post
  const { mutate } = useMutation(
    async (title: string) => await axios.post("/api/posts/addPost", { title }),
    {
      onError: (error) => {
        error instanceof AxiosError &&
          toast.error(error?.response?.data.message, { id: toastPostId })
        setIsDisabled(false)
      },
      onSuccess: (data) => {
        toast.success("Post has been added!", { id: toastPostId })
        queryClient.invalidateQueries(["posts"])
        setTitle("")
        setIsDisabled(false)
      },
    }
  )

  const submitPost = async (e: React.FormEvent) => {
    e.preventDefault()
    toastPostId = toast.loading('Your post is creating...', {id: toastPostId})
    setIsDisabled(true)
    mutate(title)
  }

  return (
    <form onSubmit={submitPost} className="bg-white my-8 p-8 rounded-md">
      <div className="flex flex-col my-4">
        <textarea
          onChange={(e) => setTitle(e.target.value)}
          name="title"
          value={title}
          placeholder="What`s on your mind ?"
          className="p-4 text-lx rounded-md bg-gray-200 my-2"
        ></textarea>
      </div>
      <div className={"lex items-center justify-between gap-2"}>
  <p className={`font-bold text-sm ${title.length > 300 ? "text-red-700" : "text-gray-700"}`}>{`${title.length}/300`}</p>
        <button
          disabled={isDisabled}
          className="text-sm bg-teal-600 text-white py-2 px-6 rounded-xl disabled:opacity-25"
          type="submit"
        >Create a post</button>
      </div>
    </form>
  )
}
