'use client'

import { useState } from "react"
import { useMutation, useQueryClient} from "@tanstack/react-query"
import axios, { AxiosError } from "axios" 
import toast from "react-hot-toast"

type AddCommentProps = {
    id?: string
}

type CommentProps = {
    postId?: string,
    title: string
}

export default function AddComments({id}: AddCommentProps) {
    const [title, setTitle] = useState("")
    const [isDisabled, setIsDisabled] = useState(false)
    const queryClient = useQueryClient() 
    let commentToastId: string

    const {mutate} = useMutation(
      async (data: CommentProps) => axios.post("/api/posts/addComment", {data}),
      {
        onSuccess: (data) => {
          setTitle("")
          setIsDisabled(false)
          toast.success("Comment has been added!", { id: commentToastId })
          queryClient.invalidateQueries(["detail-post"])
        },
        onError: (error) => {
          error instanceof AxiosError &&
          toast.error(error?.response?.data.message, { id: commentToastId })
          setIsDisabled(false)
        },
      }
    )

    const submitComment = async (e:React.FormEvent) => {
        e.preventDefault()
        setIsDisabled(true)
        commentToastId = toast.loading('Adding your comment...', {id: commentToastId})
        mutate({title, postId: id}) 
    }
    return (
      <form onSubmit={submitComment} className="bg-white my-8 p-8 rounded-md">
        <h3>Add a comment</h3>
        <div className="flex flex-col my-2">
        <textarea
          onChange={(e) => setTitle(e.target.value)}
          name="title"
          value={title}
          placeholder="What do you think about it?"
          className="p-4 text-lx rounded-md bg-gray-200 my-2"
        ></textarea>
        </div>
        <div className={"lex items-center justify-between gap-2"}>
          <p
            className={`font-bold text-sm p-2 ${
              title.length > 300 ? "text-red-700" : "text-gray-700"
            }`}
          >{`${title.length}/300`}</p>
          <button
            disabled={isDisabled}
            className="text-sm bg-teal-600 text-white py-2 px-6 rounded-xl disabled:opacity-25"
            type="submit"
          >
            Add comment
          </button>
        </div>
      </form>
    )
}