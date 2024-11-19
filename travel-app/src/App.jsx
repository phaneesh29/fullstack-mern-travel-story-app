import React from 'react'
import Login from './pages/Auth/Login'
import SignUp from './pages/Auth/SignUp'
import Home from './pages/Home/Home'
import { Routes, Route, Navigate } from "react-router-dom"

const App = () => {
  return (
    <>

      <Routes>
        <Route path="/" exact element={<Root />} />
        <Route path='/dashboard' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<SignUp />} />

      </Routes>

    </>
  )
}


const Root = () => {
  const isAuthenticated = !!localStorage.getItem("token")

  return isAuthenticated ? (<Navigate to="/dashboard" />) : (<Navigate to="/login" />)
}


export default App