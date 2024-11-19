import React from 'react'

const Inputemail = ({value,onChange}) => {
  return (
    <>
    <div>
    <input value={value} onChange={onChange} type="email" name="email" placeholder='Enter Your Email' className='p-3 bg-amber-50 text-black rounded-full focus:outline-none ring-2 ring-gray-400 w-[300px] sm:w-[600px] text-xl' />
    </div>
    </>
    
  )
}

export default Inputemail