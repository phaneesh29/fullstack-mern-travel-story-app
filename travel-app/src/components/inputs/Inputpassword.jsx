import React, { useState } from 'react'
import { FaRegEye, FaEyeSlash } from "react-icons/fa";

const Inputpassword = ({ value, onChange }) => {
    const [isShowPassword, setIsShowPassword] = useState(false)
    const toggleShowPassword = () => {
        setIsShowPassword(!isShowPassword);
    }
    return (
        <>
            <div className='flex items-center relative'>
                <input value={value} onChange={onChange} type={isShowPassword ? "text" : "password"} name="password" placeholder='Enter Your password' className='p-3 bg-amber-50 text-black rounded-full focus:outline-none ring-2 ring-gray-400 w-[300px] sm:w-[600px] text-xl' />
                {isShowPassword ? (<FaRegEye size={22} className="text-primary cursor-pointer absolute right-3 " onClick={() => toggleShowPassword()} />)
                    : (<FaEyeSlash size={22} className="text-slate-400 cursor-pointer absolute right-3 " onClick={() => toggleShowPassword()} />)}
            </div>

        </>

    )
}

export default Inputpassword