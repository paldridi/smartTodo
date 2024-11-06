import { FaEdit, FaTrashAlt } from "react-icons/fa";
import { Link } from "react-router-dom";
import { deleteBucket, editBucket } from "../api/smartTodoApi";
import { useState } from "react";

// Bucket card that recieves a bucket prop
const Buckets = ({ bucket }) => {
    const [isEditing, setisEditing] = useState(false)
    const [bucketName, setBucketName] = useState(bucket.name)
 
    const handleRename = async () =>{
        
        try {
            await editBucket(bucket.id, {name: bucketName})
            setisEditing(!isEditing);
        } catch (error) {
            console.error(error)
        }

    }

    const handleDelete = async ( bucketId) => {
        try {
            await deleteBucket(bucketId);
            window.location.reload();
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <div
            className="bg-sky-200 hover:bg-sky-300 transition-colors duration-300 cursor-pointer p-6 px-3 rounded-lg shadow-md text-center relative"
        >
            
                {isEditing ? (
                    <input 
                        type="text"
                        value={bucketName}
                        onChange={(e) => setBucketName(e.target.value)}
                        onBlur = {handleRename}
                        onKeyDown={(e) => e.key === "Enter" && handleRename() }
                        className="text-xl font-semibold text-sky-800"
                    />
                ) : (
                    <Link to={`/${bucket.name}/${bucket.id}`}>
                        <h2 className="text-xl font-semibold text-sky-800">{bucketName}</h2>
                    </Link>
                )}
                
            

            <div className="absolute top-4 right-4 flex flex-col space-y-2">
                <button className="text-sky-800 hover:text-gray-900" onClick={() =>setisEditing(!isEditing)}>
                    <FaEdit size={20} />
                </button>
                <button className="text-red-600 hover:text-red-800" onClick={() => handleDelete(bucket.id)}>
                    <FaTrashAlt size={20} />
                </button>
            </div>
        </div>
    )
    }

export default Buckets;
