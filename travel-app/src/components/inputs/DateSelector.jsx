import { useState } from "react"
import { DayPicker } from "react-day-picker"
import { MdOutlineDateRange, MdClose } from "react-icons/md"
import dayjs from "dayjs"

const DateSelector = ({ date, setDate }) => {
    const [openDatePicker, setOpenDatePicker] = useState(false)
    return (
        <div>
            <button className="inline-flex items-center gap-2 text-[13px] font-medium text-slate-600 bg-amber-100 hover:bg-yellow-200/70 rounded px-2 py-1 cursor-pointer"
                onClick={() => {
                    setOpenDatePicker(true)
                }}>
                <MdOutlineDateRange className="text-lg" />
                {date ? dayjs(date).format("DD MMM YYYY"):dayjs().format("DD MMM YYYY")}
            </button>
            {openDatePicker && <div className="overflow-y-scroll p-5 bg-gray-50 mt-2 rounded-lg relative pt-9 scrollbar">
                <button className="w-10 h-10 rounded-full flex items-center justify-center bg-amber-100 hover:bg-yellow-200 absolute top-2 right-2"
                    onClick={() => {
                        setOpenDatePicker(false)
                    }}>
                    <MdClose className="text-xl text-gray-600" />
                </button>
                <DayPicker
                    captionLayout="dropdown-buttons"
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    pageNavigation
                    
                />
            </div>}
        </div>
    )
}

export default DateSelector
