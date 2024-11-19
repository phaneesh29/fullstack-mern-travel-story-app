import React, { useEffect, useState } from 'react'
import Navbar from '../../components/Navbar'
import TravelStoryCard from '../../components/TravelStoryCard'
import EmptyStoryCard from '../../components/EmptyStoryCard'
import { useNavigate } from 'react-router-dom'
import { InfinitySpin } from 'react-loader-spinner'
import axiosInstance from "../../utils/axiosInstance"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { MdAdd } from "react-icons/md";
import Modal from "react-modal"
import AddEditTravelStory from './AddEditTravelStory'
import ViewTravelStory from './ViewTravelStory'
import { DayPicker } from 'react-day-picker'
import dayjs from 'dayjs'
import FilterInfoTitle from '../../components/FilterInfoTitle'
import { getEmptyCardMessage } from '../../utils/helper'
const Home = () => {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState("")
  const [userInfo, setUserInfo] = useState(null)
  const [loading, setLoading] = useState(true)
  const [allStories, setAllStories] = useState([])
  const [openAddEditModel, setOpenAddEditModel] = useState({
    isShown: false,
    type: "add",
    data: null,
  })
  const [openViewModel, setOpenViewModel] = useState({
    isShown: false,
    data: null
  })
  const [filterType, setFilterType] = useState("")
  const [dateRange, setDateRange] = useState(null)

  const notifySuccess = (message) => toast(message, {
    theme: "light",
    type: "success",
    position: "top-center"
  });

  const getUserInfo = async () => {
    try {
      const response = await axiosInstance.get("/get-user")
      if (response.data && response.data.user) {
        setUserInfo(response.data.user)
      }
    } catch (error) {
      if (error.response.status === 401) {
        localStorage.clear()
        navigate("/login")
      }
    }
    finally {
      setLoading(false)
    }
  }
  const getAllTravelStories = async () => {
    try {
      const response = await axiosInstance.get("/get-all-stories")
      if (response.data && response.data.stories) {
        setAllStories(response.data.stories)
      }
    } catch (error) {
      console.log(`Error occured ${error}`)
    }

  }

  const handleEdit = (data) => {
    setOpenAddEditModel({ isShown: true, type: "edit", data: data })
  }

  const handleViewStory = (data) => {
    setOpenViewModel({ isShown: true, data: data })
  }

  const updateIsFavourite = async (storyData) => {
    try {
      const storyId = storyData._id
      console.log(`/update-is-favourite/${storyId}`)
      const response = await axiosInstance.put(`/update-is-favourite/${storyId}`, {
        isFavourite: !storyData.isFavourite
      })

      if (response.data && response.data.story) {
        notifySuccess("Travel Story Updated")

        if (filterType==="search" && searchQuery) {
          onSearchStory(searchQuery)
        }
        else if(filterType==="date"){
          filterStoryByDate(dateRange)
        } else{
          getAllTravelStories()
        }

      }
    } catch (error) {
      console.log(`Error occured ${error}`)
    }
  }

  const deleteTravelStory = async (data) => {
    const storyId = data._id
    try {
      const response = await axiosInstance.delete(`/delete-travel-story/${storyId}`)
      if (response.data && !response.data.error) {
        notifySuccess("Story Deleted Successfully")
        setOpenViewModel((prevState) => ({ ...prevState, isShown: false }))
        getAllTravelStories()
      }
    } catch (error) {

      console.log("an unexpected Error")
    }

  }

  const onSearchStory = async (query) => {
    try {
      const response = await axiosInstance.get("/search", { params: { query } })
      console.log(response)
      if (response.data && response.data.stories) {
        setFilterType("search")
        setAllStories(response.data.stories)
      }
    } catch (error) {
      console.log("An unexpected error occured")
    }
  }


  const handleClearSearch = () => {
    setFilterType("")
    getAllTravelStories()

  }

  const filterStoryByDate = async (day) => {
    try {
      const startDate = day.from ? dayjs(day.from).valueOf() : null
      const endDate = day.to ? dayjs(day.to).valueOf() : null

      if (startDate && endDate) {
        const response = await axiosInstance.get("/travel-stories/filter", {
          params: { startDate, endDate }
        })

        if (response.data && response.data.stories) {
          setFilterType("date")
          setAllStories(response.data.stories)
        }
      }
    } catch (error) {
      console.log("An unexpected error occured")

    }
  }

  const handleDayClick = (day) => {
    setDateRange(day)
    filterStoryByDate(day)
  }

  const resetFilter = ()=>{
    setDateRange({from:null , to:null})
    setFilterType("")
    getAllTravelStories()
  }

  useEffect(() => {
    getAllTravelStories()
    getUserInfo()

  }, [])

  if (loading) {
    return (<div className="flex items-center justify-center min-h-screen">
      <InfinitySpin visible={true} width="200" color="#fcba03" ariaLabel="infinity-spin-loading" />
    </div>)
  }
  return (
    <>
      <section className='mt-28'>
        <ToastContainer />
        <Navbar userInfo={userInfo} searchQuery={searchQuery} setSearchQuery={setSearchQuery} onSearchNote={onSearchStory} handleClearSearch={handleClearSearch} />

        <div>
          <FilterInfoTitle
            filterType={filterType}
            filterDates={dateRange}
            onClear={() => {
              resetFilter()
            }}
          />
        </div>
        <div className='flex justify-between p-6 items-center'>

          {allStories.length > 0 ?
            (<div className='flex justify-between gap-4 items-center flex-wrap'>
              {(allStories.map((item) => (
                <TravelStoryCard key={item._id} imgUrl={item.imageUrl} title={item.title} story={item.story} date={item.visitedDate} visitedLocation={item.visitedLocation} isFavourite={item.isFavourite} onClick={() => handleViewStory(item)} onFavouriteClick={() => updateIsFavourite(item)} />
              )))}
            </div>) :
            (<>
              <div className='bg-gray-400/20 rounded-lg m-5 p-2 flex justify-center items-center min-h-[300px]'>
                <EmptyStoryCard message={getEmptyCardMessage(filterType)} />
              </div>
            </>)
          }
          <div className='min-w-[300px]'>
            <DayPicker
              captionLayout='dropdown-buttons'
              mode="range"
              selected={dateRange}
              onSelect={handleDayClick}
              pagedNavigation
            />
          </div>
        </div>



        {/* Model For Add and  Edit */}
        <Modal
          isOpen={openAddEditModel.isShown}
          onRequestClose={() => { }}
          style={{
            overlay: {
              backgroundColor: "rgba(0,0,0,0.2)",
              zIndex: 999
            }
          }}
          appElement={document.getElementById("root")}
          className="rounded-lg w-[90vw] mx-auto bg-white h-[90vh] mt-14 overflow-y-scroll p-3 scrollbar"
        >
          <AddEditTravelStory type={openAddEditModel.type} storyInfo={openAddEditModel.data} onClose={() => {
            setOpenAddEditModel({ isShown: false, type: "add", data: null })
          }} getAllTravelStories={getAllTravelStories} />
        </Modal>

        <Modal
          isOpen={openViewModel.isShown}
          onRequestClose={() => { }}
          style={{
            overlay: {
              backgroundColor: "rgba(0,0,0,0.2)",
              zIndex: 999
            }
          }}
          appElement={document.getElementById("root")}
          className="rounded-lg w-[90vw] mx-auto bg-white h-[90vh] mt-14 overflow-y-scroll p-3 scrollbar"
        >
          <ViewTravelStory
            storyInfo={openViewModel.data || null}
            onClose={() => {
              setOpenViewModel((prevState) => ({ ...prevState, isShown: false }))
            }}
            onEditClick={() => {
              setOpenViewModel((prevState) => ({ ...prevState, isShown: false }))
              handleEdit(openViewModel.data || null)
            }}
            onDeleteClick={() => {
              deleteTravelStory(openViewModel.data || null)
            }}
          />
        </Modal>

        <button className='bg-yellow-400 h-[50px] w-[50px] flex justify-center items-center rounded-full font-extrabold text-5xl fixed right-3 bottom-3 hover:bg-amber-400 hover:shadow-lg transition-all' onClick={() => {
          setOpenAddEditModel({
            isShown: true,
            type: "add",
            data: null
          })
        }}>

          <MdAdd />

        </button>

      </section>
    </>
  )
}

export default Home