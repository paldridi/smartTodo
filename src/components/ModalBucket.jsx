import { addBucket } from "../api/smartTodoApi";
import { useState } from "react";

const Modal = ({ isOpen, onClose, bucketLength }) => {
  const [bucketName, setBucketName] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    // To make sure non 
    if (bucketName.trim()){
        //create a new bucket object
        const newBucketId = (bucketLength + 1).toString()
        const newBucket = {
            id: newBucketId,
            name: bucketName,
            todo_lists: []
        }
        //send api request
        try {
            await addBucket(newBucket)  
            window.location.reload();
        } catch (error) {
            console.error('error adding bucket')
        }
        
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg p-4 max-w-sm w-full">
        <h2 className="text-lg font-bold mb-2">Add New Bucket</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={bucketName}
            onChange={(e) => setBucketName(e.target.value)}
            placeholder="Bucket Name"
            className="border border-gray-300 rounded p-2 w-full mb-4"
          />
          <div className="flex justify-between">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-300 text-gray-700 rounded px-4 py-2 hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-purple-600 text-white rounded px-4 py-2 hover:bg-purple-700"
            >
              Add Bucket
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Modal