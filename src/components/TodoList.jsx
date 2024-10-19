import { FaEdit, FaTrashAlt, FaCheckCircle } from 'react-icons/fa';

const TodoList = ({todo}) => {
  return (
    <>
        <div className="w-3/4">
            <h2 className="text-xl font-semibold text-blue-800">{todo.title}</h2>
            <p className="text-gray-700 mt-1">{todo.description}</p>
            <p className="text-gray-600 mt-1">Deadline: {new Date(todo.deadline).toLocaleDateString()}</p>
            <p className="text-gray-500 italic mt-1">AI Recommendation: {todo.ai_recommendation}</p>
            <p className="mt-2">
            Status: {todo.done ? (                       
                <span className="text-green-600 font-semibold">Completed</span>
                ) : (
                <span className="text-red-600 font-semibold">Not Completed</span>
            )}                   
                </p>
        </div>

        <div className="w-1/4 flex justify-around"> {/* Right side (25% width) */}
            <button className="text-sky-600 hover:text-sky-800">
                <FaEdit />
            </button>
            <button className="text-red-600 hover:text-red-800">
                <FaTrashAlt />
            </button>
            <button className="text-green-600 hover:text-green-800">
                <FaCheckCircle />
            </button>
        </div>
    </>
  )
}

export default TodoList
