import { useState } from "react"
import { editTodoInBucket } from "../api/smartTodoApi";

const EditTodo = ({ todoData , setIsEditing, bucketId}) => {
    const [formData, setFormData] = useState({
        title: todoData.title,
        description: todoData.description,
        deadline: new Date(todoData.deadline).toISOString().slice(0, 16),
        ai_recommendation: todoData.ai_recommendation,
        done: todoData.done,
      });
    
    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData({...formData, [name]: value})
    }
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const updatedTodo = {
                title: formData.title,
                description: formData.description,
                deadline: formData.deadline,
                ai_recommendation: formData.ai_recommendation,
                done: formData.done,
            }

            await editTodoInBucket(bucketId, todoData.id, updatedTodo)
            setIsEditing(false);
            // window.location.reload(bucketId, todoData.id)
        } catch (error) {
            console.error(error)
        }
    }

    return (
    <div>
        <form onSubmit={handleSubmit} className="flex flex-col">
            <div className="mb-4">
                <label className="block text-sm font-semibold mb-1">Title</label>
                <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                    required
                />
            </div>
            <div className="mb-4">
                <label className="block text-sm font-semibold mb-1">Description</label>
                <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                    required
                />
            </div>
            <div className="mb-4">
                <label className="block text-sm font-semibold mb-1">Deadline</label>
                <input
                    type="datetime-local"
                    name="deadline"
                    value={formData.deadline}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                    required
                />
            </div>
            <div className="flex justify-end">
                <button
                    type="button"
                    onClick={() => setIsEditing(false)} // Cancel editing
                    className="mr-2 bg-gray-300 text-gray-800 px-4 py-2 rounded"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    className="bg-sky-600 text-white px-4 py-2 rounded hover:bg-sky-700"
                >
                    Save
                </button>
            </div>
        </form>
    </div>
  )
}

export default EditTodo
