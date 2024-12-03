
import { useParams, useLoaderData } from "react-router-dom";
import TodoList from "../components/TodoList";
import { useState, useEffect } from "react";
import { AiOutlinePlus } from 'react-icons/ai';
import ModalToDoList from "../components/ModalToDoList";
import { deleteTodoFromBucket, editTodoInBucket } from '../api/smartTodoApi';


const BucketPage = () => {
  const bucketData = useLoaderData();
  const [todoList, setTodoList] = useState(bucketData ? bucketData.todo_lists : []);
  const [isTodoModalOpen, setTodoModalOpen] = useState(false);
  const { bucket_id } = useParams();

  useEffect(() => {
    if (bucketData) {
      setTodoList(bucketData.todo_lists);
    }
  }, [bucketData]);

  const handleDelete = async (id) => {
    try {
      await deleteTodoFromBucket(bucket_id, id);
      setTodoList((prevList) => prevList.filter((todo) => todo.id !== id));
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };

  const handleEdit = async (id, updatedData) => {
    try {
      await editTodoInBucket(bucket_id, id, updatedData);
      setTodoList((prevList) => prevList.map((todo) =>
        todo.id === id ? { ...todo, ...updatedData } : todo
      ));
    } catch (error) {
      console.error('Error editing todo:', error);
    }
  };

  const handleComplete = (id) => {
    setTodoList((prevList) => prevList.map((todo) =>
      todo.id === id ? { ...todo, done: true } : todo
    ));
  };

  return (
    <div className="bg-sky-100 min-h-screen flex items-center justify-center py-10">
      <div className="w-full max-w-3xl bg-sky-200 rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold text-sky-800 text-center mb-6">
          Todo Lists for {bucketData?.name || `Bucket ID ${bucket_id}`}
        </h1>
        <ul className="space-y-6">
          {todoList && todoList.length > 0 ? (
            todoList.map((todo) => (
              <li key={todo.id} className="p-4 bg-white rounded-lg shadow-md flex justify-between items-center hover:shadow-lg transition-shadow duration-300">
                <TodoList
                  todo={{ ...todo, id: String(todo.id) }} // Ensure todo.id is a string
                  onDelete={handleDelete}
                  onEdit={(updatedData) => handleEdit(todo.id, updatedData)}
                  onComplete={handleComplete}
                  bucketId={bucket_id}
                />
              </li>
            ))
          ) : (
            <p className="text-center text-gray-600">No todos available for this bucket.</p>
          )}
        </ul>
        <button className="absolute bottom-4 right-4 bg-sky-600 text-white rounded-full p-4 shadow-md hover:bg-sky-700 focus:outline-none"
          onClick={() => setTodoModalOpen(true)}
        >
          <AiOutlinePlus size={20} />
        </button>
      </div>
      <ModalToDoList
        isOpen={isTodoModalOpen}
        onClose={() => setTodoModalOpen(false)}
        todoLength={todoList.length}
        bucketId={bucket_id}
        todoList={todoList}
      />
    </div>
  );
};

// Updated todoLoader function to fetch the entire bucket, including name and todos
// todoLoader function to fetch the entire bucket, including name and todos
const todoLoader = async ({ params }) => {
  try {
    const { bucket_id } = params;
    const res = await fetch(`http://localhost:8000/buckets/${bucket_id}`);
    const data = await res.json();

    if (data && data.name && data.todo_lists) {
      return data; // Return the entire bucket data (name, description, and todo lists)
    } else {
      console.error("Data format error:", data);
      return { name: `Bucket ID ${bucket_id}`, todo_lists: [] }; // Return placeholder if data is incorrect
    }
  } catch (error) {
    console.error("Error fetching bucket:", error);
    return { name: `Bucket ID ${bucket_id}`, todo_lists: [] }; // Return placeholder in case of error
  }
};

// Ensure you export `todoLoader` alongside `BucketPage`
export { BucketPage as default, todoLoader };


