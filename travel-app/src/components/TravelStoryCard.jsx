import React from 'react'
import { FaHeart } from "react-icons/fa";
import { GrMapLocation } from "react-icons/gr";
import dayjs from 'dayjs';
const TravelStoryCard = ({ imgUrl, title, story, date, visitedLocation, isFavourite, onEdit, onClick, onFavouriteClick }) => {
  return (
    <div className='w-[300px] p-2 border-2 rounded-xl border-gray-100 hover:shadow-md transition-all bg-amber-50 relative'>
      <button className={`${isFavourite ? "text-red-600" : "text-gray-100"} w-10 h-10 bg-amber-50/25  absolute rounded-full p-2 flex justify-center items-center right-3 top-3 hover:text-red-600`} onClick={onFavouriteClick} ><FaHeart size={20} /></button>
      <div className='border-b-amber-400 border-b-4'><img src={imgUrl} alt={title} className='rounded-lg w-full border-b-2 overflow-hidden  cursor-pointer' onClick={onClick} /></div>
      <div className='mt-3 px-2'>
        <p className='text-xl font-medium'>{title}</p>
        <span className='text-slate-500 font-medium text-lg'>{date ? dayjs(date).format("DD MMM YYYY") : "-"}</span>
      </div>
      <p className='text-base px-1 bg-slate-50 mt-2 break-words'>{story?.slice(0, 60)}</p>
      <div className='mt-2 text-lg inline-flex items-center p-1 px-2 gap-1 rounded-full bg-yellow-300 hover:bg-amber-200'>
        <GrMapLocation size={20} />
        {visitedLocation.map((item, index) => (
          visitedLocation.length == index + 1 ? `${item}` : `${item}`
        ))}
      </div>

    </div>
  )
}

export default TravelStoryCard