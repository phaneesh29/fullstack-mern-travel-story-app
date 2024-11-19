import React from 'react'

const Inputname = ({value,onChange}) => {
  return (
    <>
    <div>
    <input value={value} onChange={onChange} type="text" name="fullName" placeholder='Enter Your Full Name' className='p-3 bg-amber-50 text-black rounded-full focus:outline-none ring-2 ring-gray-400 w-[300px] sm:w-[600px] text-xl' />
    </div>
    </>
    
  )
}

export default Inputname