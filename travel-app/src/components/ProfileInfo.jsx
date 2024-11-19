import React from 'react'
import { IoMdLogOut } from "react-icons/io";
import { getInitials } from "../utils/helper"
const ProfileInfo = ({ userInfo, onLogOut }) => {

  return (
     userInfo && (<div className='flex justify-center items-center gap-3'>
      <div className='h-[50px] w-[50px] flex justify-center items-center text-3xl font-bold bg-yellow-500 rounded-full text-center text-slate-950 p-6'>
        {getInitials(userInfo ? userInfo.fullName : "")}
      </div>

      <div>
        <p className=''>{userInfo?.fullName || ""}</p>
        <button onClick={onLogOut} className='underline text-red-600 flex justify-center items-center gap-1'>
          <p>Logout</p> <IoMdLogOut />
        </button>
      </div>
    </div>)
  )
}

export default ProfileInfo