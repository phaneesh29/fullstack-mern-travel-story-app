import dayjs from 'dayjs';
import React from 'react'
import { MdOutlineClose } from 'react-icons/md';

const FilterInfoTitle = ({ filterType, filterDates, onClear }) => {

    const DateRangeChip = ({ date }) => {
        const startDate = date?.from ? dayjs(date?.from).format("DD MMM YYYY") : "N/A";
        const endDate = date?.to ? dayjs(date?.to).format("DD MMM YYYY") : "N/A";

        return (
            <div className="flex items-center gap-2 bg-slate-100 px-3 py-2 rounded">
                <p className="text-xs font-medium ">
                    {startDate} - {endDate}
                </p>

                <button onClick={onClear}>
                    <MdOutlineClose />
                </button>
            </div>

        )
    }


    return (
        filterType && (
            <div className='p-2 text-xl '>
                {
                    filterType === "search" ? (
                        <h3>Search Results</h3>
                    ) : (
                        <div className='flex items-center gap-4'>
                            <h3>Travel Stories From</h3>
                            <DateRangeChip date={filterDates} />
                        </div>
                    )
                }
            </div>)
    )
}

export default FilterInfoTitle