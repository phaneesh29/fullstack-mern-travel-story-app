import { useState } from "react"
import { MdAdd, MdClose } from "react-icons/md"
import { GrMapLocation } from "react-icons/gr"

const TagInput = ({ tags, setTags }) => {
    const [inputValue, setInputValue] = useState("")
    const addNewTag = () => {
        if (inputValue.trim() !== 0) {
            setTags([...tags, inputValue.trim()])
            setInputValue("")
        }
    }
    const handleInputChange = (e) => {
        setInputValue(e.target.value)
    }
    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            addNewTag()
        }
    }
    const handleRemoveTag = (tagToRemove) => {
        setTags(tags.filter((tag) => tag !== tagToRemove))
    }
    return (
        <div>
            {
                tags.length > 0 && (
                    <div className="flex items-center gap-2 flex-wrap my-2">
                        {tags.map((tag, index) => (
                            <span key={index} className="flex items-center gap-2  justify-between text-base text-slate-600 bg-amber-100 px-3 py-1 rounded-lg">
                                <GrMapLocation />{tag}
                                <button onClick={() => handleRemoveTag(tag)} className="text-red-600 flex justify-center items-center">
                                    <MdClose />
                                </button>
                            </span>
                        ))}
                    </div>
                )
            }


            <div className="flex items-center gap-2">
                <input type="text"
                    value={inputValue}
                    className="text-sm border-2 px-3 py-2 rounded-lg outline-none "
                    placeholder="Add location"
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                />
                <button className="w-8 h-8 flex justify-center items-center rounded-full border-2 border-gray-200 hover:bg-yellow-200" onClick={addNewTag}>
                    <MdAdd className="text-2xl text-slate-700" />
                </button>
            </div>

        </div>
    )
}

export default TagInput
