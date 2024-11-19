import React from 'react'
import LOGO from "../assets/logo.png"
import { useNavigate } from "react-router-dom"
import Searchbar from './inputs/Searchbar'
import ProfileInfo from './ProfileInfo'
const Navbar = ({ userInfo, searchQuery, setSearchQuery,onSearchNote,handleClearSearch }) => {
  const isToken = localStorage.getItem("token")
  const navigate = useNavigate()

  const onLogOut = () => {
    localStorage.clear()
    navigate("/")
  }

  const handleSearch = ()=>{
    if (searchQuery) {
      onSearchNote(searchQuery)
    }
  }
  const onClearSearch = ()=>{
    handleClearSearch()
    setSearchQuery("")
  }


  return (
    <>
      <nav className='flex justify-between items-center fixed top-4 rounded-full left-2 right-2 p-2 px-4 ring-2 ring-amber-300 bg-yellow-50 z-50 shadow-lg'>
        <div><img src={LOGO} alt="LOGO" className='h-[50px] w-[50px] rounded-full ' /></div>

        {isToken &&
          <>
            <Searchbar value={searchQuery} onChange={({ target }) => { setSearchQuery(target.value) }} handleSearch={handleSearch} onClearSearch={onClearSearch} />
            <ProfileInfo userInfo={userInfo} onLogOut={onLogOut} />
          </>
        }


      </nav>
    </>
  )
}

export default Navbar