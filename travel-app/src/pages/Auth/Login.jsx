import React, { useState } from 'react'
import loginbg from "../../assets/loginbg.png"
import { useNavigate,useLocation } from "react-router-dom"
import Inputpassword from '../../components/inputs/Inputpassword'
import Inputemail from '../../components/inputs/Inputemail'
import axiosInstance from "../../utils/axiosInstance"
import { validateEmail } from '../../utils/helper'
const Login = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState(null)
  const navigate = useNavigate()
  const location = useLocation()

  const redirectTo = location.state?.from || "/dashboard"
  const handleLogin = async (e) => {
    e.preventDefault()
    if (!validateEmail(email)) {
      setError("please Enter valid email address")
      return
    }
    if (!password) {
      setError("Please Enter password!")
      return
    }
    setError("")

    try {
      const response = await axiosInstance.post("/login", {
        email: email,
        password: password
      })
      if (response.data && response.data.accessToken) {
        localStorage.setItem("token", response.data.accessToken)
        navigate(redirectTo, { replace: true })
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        setError(error.response.data.message)
      } else {
        setError("An unexpected error occurred. Please try again.")
      }
    }
  }


return (
  <>
    <div className='flex justify-center flex-col items-center mt-[20px] p-3 rounded-lg m-1'>
      <div className='flex justify-between  bg-amber-50 p-3 gap-5 rounded-lg items-center'>
        <div style={{ backgroundImage: `url(${loginbg})`, backgroundPosition: "center", backgroundSize: "cover", height: "550px" }} className='relative rounded-lg w-[400px] hidden lg:block'>

          <h1 className='text-center mt-3 font-bold text-4xl absolute bottom-0 pb-1 text-white bg-black overflow-hidden rounded-b-lg bg-opacity-60'>Login to Add Your Travel Stories</h1>

        </div>

        <div>
          <h1 className='text-center mb-8 text-5xl font-bold'>Login</h1>
          <div className='shadow-xl rounded-lg bg-gray-50 p-4'>
            <form onSubmit={handleLogin} className='rounded-lg p-3 flex flex-col justify-center items-center gap-6 '>
              <Inputemail value={email} onChange={({ target }) => { setEmail(target.value) }} />
              <Inputpassword value={password} onChange={({ target }) => { setPassword(target.value) }} />
              {error && <p className='text-left text-red-500 font-medium'>{error}</p>}
              <button type='submit' className='p-2 text-xl bg-amber-400 rounded-full font-semibold text-black  hover:bg-amber-100 transition-all w-[200px] active:scale-105'>Login</button>
            </form>
            <p className='text-gray-400 text-center mt-10 text-base'>Or</p>
            <button onClick={() => { navigate("/signup") }} className='p-2 bg-amber-100 rounded-full text-xl font-semibold m-auto w-[200px] block mt-10 hover:bg-amber-400  transition-all active:scale-105'>Create Account</button>
          </div>
        </div>
      </div>

    </div >
  </>
)
}

export default Login