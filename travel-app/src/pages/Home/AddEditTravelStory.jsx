import React, { useState } from 'react'
import { MdAdd, MdClose, MdDeleteForever, MdUpdate } from 'react-icons/md'
import DateSelector from '../../components/inputs/DateSelector'
import ImageSelector from '../../components/inputs/ImageSelector'
import axiosInstance from '../../utils/axiosInstance'
import TagInput from '../../components/inputs/TagInput'
import dayjs from 'dayjs'
import uploadImage from "../../utils/uploadImage"
import { ToastContainer, toast } from "react-toastify";


const AddEditTravelStory = ({ storyInfo, type, onClose, getAllTravelStories }) => {

    const [title, setTitle] = useState(storyInfo?.title || "")
    const [storyImg, setStoryImg] = useState(storyInfo?.imageUrl || null)
    const [story, setStory] = useState(storyInfo?.story || "")
    const [visitedLocation, setVisitedLocation] = useState(storyInfo?.visitedLocation || [])
    const [visitedDate, setVisitedDate] = useState(storyInfo?.visitedDate || null)
    const [error, setError] = useState("")

    const addNewTravelStory = async () => {
        try {
            let imageUrl = ""
            if (storyImg) {
                const imageUploadRes = await uploadImage(storyImg)
                imageUrl = imageUploadRes.imageUrl || ""
            }
            const response = await axiosInstance.post("/add-travel-story", {
                title,
                story,
                imageUrl: imageUrl || "",
                visitedLocation,
                visitedDate: visitedDate ? dayjs(visitedDate).valueOf() : dayjs().valueOf()
            })
            if (response.data && response.data.story) {
                console.log("added story", response.data)
                toast.success("Story added successfully")
                getAllTravelStories()
                onClose()
            }

        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                setError(error.response.data.message)
            } else {
                setError("Something went wrong")
            }
        }
    }


    const updateTravelStory = async () => {
        const storyId = storyInfo._id
        try {
            let imageUrl =  ""
            let postData = {
                title,
                story,
                imageUrl: storyInfo.imageUrl || "",
                visitedLocation,
                visitedDate: visitedDate
                    ? dayjs(visitedDate).valueOf()
                    : dayjs().valueOf()
            }

            if (typeof storyImg === "object") {
                const imgUploadRes = await uploadImage(storyImg)
                imageUrl = imgUploadRes.imageUrl || ""

                postData = {
                    ...postData,
                    imageUrl: imageUrl
                }
            }

            const response = await axiosInstance.put(`/edit-travel-story/${storyId}`, postData)
            if (response.data && response.data.story) {
                toast.success("Story Updated successfully")
                getAllTravelStories()
                onClose()
            }

        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                setError(error.response.data.message)
            } else {
                setError("Something went wrong")
            }
        }
    }

    const handleAddOrUpdateClick = () => {
        if (!title) {
            setError("Please enter the title")
            return
        }
        if (!story) {
            setError("Please enter the story")
            return
        }
        setError("")
        if (type == "edit") {
            updateTravelStory()
        } else {
            addNewTravelStory()
        }
    }

    const handleDeleteImg = async () => {
        const deleteImgRes = await axiosInstance.delete("/delete-image", {
            params: {
                imageUrl: storyInfo.imageUrl
            }
        })
        if (deleteImgRes.data) {
            const storyId = storyInfo._id
            const postData = {
                title,
                story,
                visitedLocation,
                visitedDate: dayjs().valueOf(),
                imageUrl: ""
            }
            const response = await axiosInstance.put(
                `/edit-travel-story/${storyId}` ,
                postData
            )
            setStoryImg(null)
        }
    }
    return (
        <div>
            <ToastContainer />
            <div className='flex justify-between items-center'>
                <h1 className='text-2xl font-bold'>
                    {type === "add" ? "Add Story" : "Edit Story"}
                </h1>

                <div className='flex justify-end items-center gap-3 '>
                    {type === "add" ? (<button onClick={handleAddOrUpdateClick} className='bg-amber-100 flex justify-center items-center p-2 rounded-full hover:bg-amber-200 transition-all '>
                        <MdAdd className='text-lg' /> Add Story
                    </button>) : (<>
                        <button onClick={handleAddOrUpdateClick} className='bg-amber-100 flex justify-center items-center p-2 rounded-full hover:bg-amber-200 transition-all '>
                            <MdUpdate className='text-lg' /> Edit Story
                        </button>

                    </>)}
                    <button onClick={onClose} className='bg-yellow-100 p-2 rounded-full text-center hover:bg-yellow-200 transition-all'>
                        <MdClose className='text-xl text-slate-900' />
                    </button>
                </div>
            </div>

            <div className='flex flex-col mt-2 p-3'>
                {error && (<p className="text-red-500 text-base text-right">{error}</p>)}
                <label htmlFor="title" className='text-sm'>Title</label>
                <input value={title} onChange={({ target }) => setTitle(target.value)} type="text" id='title' placeholder='A day in NICE road' className='text-xl focus:outline-none ring-2 ring-gray-100 p-2 rounded-lg mt-1' />

                <div className='my-3'>
                    <DateSelector date={visitedDate} setDate={setVisitedDate} />
                </div>

                <ImageSelector image={storyImg} setImage={setStoryImg} handleDeleteImg={handleDeleteImg} />


                <div className='flex flex-col my-3'>
                    <label htmlFor="story" className='text-sm'>Story</label>
                    <textarea value={story} onChange={({ target }) => { setStory(target.value) }} id="story" className='text-lg mt-1 focus:outline-none ring-2 ring-gray-100 p-2 rounded-lg min-h-[100px]' placeholder='Hello this is my story'></textarea>

                </div>

                <div className="flex flex-col my-3">
                    <label className="text-sm">Visited Locations</label>
                    <TagInput tags={visitedLocation} setTags={setVisitedLocation} />
                </div>
            </div>
        </div>
    )
}

export default AddEditTravelStory