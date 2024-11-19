import React from 'react'
import { FaMagnifyingGlass } from "react-icons/fa6"
import {IoMdClose} from "react-icons/io"
const Searchbar = ({value,onChange,handleSearch,onClearSearch}) => {
  return (
    <div className='w-[300px] border-2 border-slate-300 text-lg rounded-full flex justify-center items-center'>
      <input type="text" placeholder="Search Story" value={value} onChange={onChange} className='p-2 px-3 w-full rounded-full focus: outline-none bg-transparent text-lg' />

      {value && (<IoMdClose 
            className="text-xl text-slate-600 cursor-pointer hover:text-black mr-2" 
            onClick={onClearSearch}/>
        )}

      <FaMagnifyingGlass
      className="text-slate-600 text-xl  cursor-pointer hover:text-black mr-2" 
      onClick={handleSearch}/>
    </div>
  )
}

export default Searchbar