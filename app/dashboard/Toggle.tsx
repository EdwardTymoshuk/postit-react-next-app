'use client'

import { ToggleProps } from "../types/ToggleProps"

export default function Toggle({deletePost, setToggle}: ToggleProps) {
    return (
        <div onClick={e => setToggle(false)} className="fixed bg-black/50 w-full h-full z-20 left-0 top-0">
            <div className="absolute bg-white text-center top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-12 rounded-lg flex flex-col gap-6">
                <h2 className="text-lg">
                    Are you sure you want to delete this post? 
                </h2>
                <h3 className="text-red-600 text-sm">
                    Pressing the delete button will permamently delete your post.
                </h3>
                <button onClick={deletePost} className="bg-red-600 text-sm text-white py-2 px-4 rounded-md self-center">Delete post</button>
            </div>
        </div>
    )
}