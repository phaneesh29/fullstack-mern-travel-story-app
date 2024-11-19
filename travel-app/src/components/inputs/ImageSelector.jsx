import { useEffect, useRef, useState } from "react"
import { FaRegFileImage } from "react-icons/fa6"
import { MdDelete } from "react-icons/md"
const ImageSelector = ({ image, setImage, handleDeleteImg }) => {
    const inputRef = useRef(null)
    const [previewUrl, setPreviewUrl] = useState(null)
    const handleImageChange = (event) => {
        const file = event.target.files[0]
        if (file) {
            setImage(file)
        }
    }
    const onChooseFile = () => {
        inputRef.current.click()
    }
    const handleRemoveImage = () => {
        setImage(null)
        handleDeleteImg()
    }


    useEffect(() => {
        if (typeof image === 'string') {
            setPreviewUrl(image)
        } else if (image) {
            setPreviewUrl(URL.createObjectURL(image))
        } else {
            setPreviewUrl(null)
        }
        return () => {
            if (previewUrl && typeof previewUrl === 'string' && !image) {
                URL.revokeObjectURL(previewUrl)
            }
        }
    }, [image])


    return (
        <div>
            <input type="file"
                accept="image/*"
                ref={inputRef}
                onChange={handleImageChange}
                className="hidden" />

            {!image ? (<button className="w-full h-[220px] flex flex-col items-center justify-center gap-4 bg-gray-100 rounded-lg border-2 border-slate-200"
                onClick={() => onChooseFile()}>
                <div className="w-14 h-14 flex items-center justify-center bg-amber-50 rounded-full border-2 border-gray-100">
                    <FaRegFileImage className="text-xl text-yellow-500" />
                </div>
                <p className="text-sm text-slate-500">Browse image files to upload</p>
            </button>) : (<div className="w-full relative">
                <img src={previewUrl} alt="Selected" className="w-full h-[300px] object-cover rounded-lg" />
                <button className="absolute top-2 right-2 bg-gray-100 text-red-700 text-xl w-10 h-10 flex justify-center items-center rounded-full"
                    onClick={handleRemoveImage}
                >
                    <MdDelete />
                </button>
            </div>)}
        </div>
    )
}

export default ImageSelector
