import React from 'react'
import noTravelStory from "../assets/notravelstory.webp"

const EmptyStoryCard = ({message}) => {
  return (
    <div className='flex flex-col justify-center items-center gap-3'>
      <img src={noTravelStory} alt="Image" width="300px" className='rounded-lg'/>
      <p className='text-lg'>{message}</p>
    </div>
  )
}

export default EmptyStoryCard