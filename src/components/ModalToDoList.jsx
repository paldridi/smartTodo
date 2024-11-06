import { addTodoListToBucket } from "../api/smartTodoApi"
import { useState } from "react";


const ModalToDoList = ({ isOpen, onClose, todoList, todoLength, bucketId }) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        deadline: '',
        ai_recommendation: '',
        done: false,
      });

    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setFormData({...formData, [name]: value})
    }

    const handleSubmit =  async (e) => {
        e.preventDefault();
        const newTodoId = (todoLength + 1).toString()
        const newTodo = {
            id: newTodoId,
            title: formData.title,
            description: formData.description,
            deadline: formData.deadline,
            ai_recommendation: formData.ai_recommendation,
            done: formData.done
        }

        const updatedToDoLists = [...todoList, newTodo]

        // send api request
        try {
            await addTodoListToBucket(bucketId, updatedToDoLists)
            window.location.reload()
        } catch(error){
            console.error('error adding todo')
        }
    }

    if (!isOpen) return null;

  
    return (
        <div>
          <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
            <div className="bg-white w-full max-w-md p-6 rounded-lg shadow-lg">
              <h2 className="text-2xl font-bold mb-4">Add a New To Do</h2>
              <form onSubmit={handleSubmit}>
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
                    onClick={onClose}
                    className="mr-2 bg-gray-300 text-gray-800 px-4 py-2 rounded"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-sky-600 text-white px-4 py-2 rounded hover:bg-sky-700"
                  >
                    Add
                  </button>
                </div>
              </form>
            </div>
          </div>
      </div>
  )
}

export default ModalToDoList
