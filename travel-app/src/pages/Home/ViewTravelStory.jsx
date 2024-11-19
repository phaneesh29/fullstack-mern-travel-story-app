import dayjs from "dayjs"
import { GrMapLocation } from "react-icons/gr"
import { MdUpdate,MdClose, MdDeleteForever } from "react-icons/md"
const ViewTravelStory = ({storyInfo,onClose,onEditClick,onDeleteClick}) => {
    
    
    return (
        <div className="relative">
            <div className="flex items-center justify-end">
                <div>
                    <div className="flex items-center gap-3">
                        <button className="bg-amber-100 flex justify-center items-center p-2 rounded-full hover:bg-amber-200 transition-all gap-1" onClick={onEditClick}>
                            <MdUpdate className="text-lg"/>Update
                        </button>
                        <button className="bg-amber-100 flex justify-center items-center p-2 rounded-full hover:bg-amber-200 transition-all gap-1 text-red-600" onClick={onDeleteClick}>
                            <MdDeleteForever className="text-lg"/>Delete
                        </button>
                        <button className="bg-amber-100 text-xl flex justify-center items-center p-2 rounded-full hover:bg-amber-200 transition-all text-slate-900" onClick={onClose}>
                            <MdClose/>
                        </button>
                    </div>
                </div>
            </div>
            <div>
                <div className="flex-1 flex flex-col gap-2 py-4">
                    <h1 className="text-2xl text-slate-950 ">
                        {storyInfo && storyInfo.title}
                    </h1>
                    <div className="flex items-center justify-between gap-3">
                        <span className="text-xs text-slate-500">
                            {storyInfo && dayjs(storyInfo.visitedDate).format("DD MMM YYYY")}
                        </span>
                        <div className="inline-flex 
                        items-center gap-2 
                        text-[13px] 
                        text-slate-600 
                        bg-yellow-200/40 
                        rounded px-2 py-1">
                            <GrMapLocation className="text-sm"/>
                            {storyInfo && storyInfo.visitedLocation.map(
                                (item,index)=>
                                storyInfo.visitedLocation.length == index+1
                                ?`${item}`
                                :`${item},` 
                                )}
                        </div>
                    </div>

                </div>
                    <img src={storyInfo && storyInfo.imageUrl} alt="Image"
                    className="w-full h-[300px] object-cover rounded-lg" />
                    <div className="mt-4">
                        <p className="text-base text-slate-950 leading-6 text-justify whitespace-pre-line">{storyInfo.story}</p>
                    </div>
            </div>
        </div>
    )
}

export default ViewTravelStory
