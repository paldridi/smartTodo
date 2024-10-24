import { useState } from 'react';
import { FaEdit, FaTrashAlt, FaCheckCircle, FaCaretDown, FaCaretUp } from 'react-icons/fa';

const TodoList = ({todo, onDelete, onComplete, onEdit}) => {
    const [isOpen, setIsOpen] = useState(false);

    // manage toggledown
    const toggleDropdown = () => {
        setIsOpen(!isOpen)
    }


  
    return (
    <>
        <div className="w-full grid grid-rows-2 p-2 bg-sky-100 rounded-lg shadow-md">
            {/* First Row: Title, Deadline, Buttons, and Dropdown Toggle */}
            <div className='flex justify-between items-center'>
                <div>
                {/* Title */}
                <h2 className="text-xl font-semibold text-blue-800">{todo.title}</h2>
                {/* Deadline */}
                <p className="text-gray-600 mt-1">Deadline: {new Date(todo.deadline).toLocaleDateString()}</p>
                </div>
                
                {/* Buttons and Dropdown Toggle */}
                <div className='flex items-center space-x-4'>
                {/* Action Buttons */}
                <button className="text-sky-600 hover:text-sky-800" onClick={() => onEdit(todo.id)}>
                    <FaEdit />
                </button>
                <button className="text-red-600 hover:text-red-800" onClick={() => onDelete(todo.id)}>
                    <FaTrashAlt />
                </button>
                <button className="text-green-600 hover:text-green-800" onClick={() => onComplete(todo.id)}>
                    <FaCheckCircle />
                </button>

                {/* Dropdown Toggle Button */}
                <button onClick={toggleDropdown} className='text-gray-600 flex items-center'>
                    {isOpen ? <FaCaretUp /> : <FaCaretDown />}
                    <span className="ml-1">{isOpen ? 'Hide Details' : 'Show Details'}</span>
                </button>
                </div>
            </div>

            {/* Second Row: Dropdown Content (Shown when isOpen is true) */}
            {isOpen && (
                <div className="mt-4 text-gray-700">
                <p>Description: {todo.description}</p>
                <p className="italic">AI Recommendation: {todo.ai_recommendation}</p>
                <p>Status: {todo.done ? (
                    <span className="text-green-600 font-semibold">Completed</span>
                ) : (
                    <span className="text-red-600 font-semibold">Not Completed</span>
                )}</p>
                </div>
            )}
        </div>

    </>
  )
  }

export default TodoList
