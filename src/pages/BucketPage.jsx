import { useParams, useLoaderData } from "react-router-dom"
import TodoList from "../components/TodoList";

const BucketPage = ( {} ) => {
  
  const todoList = useLoaderData();
  console.log(todoList)
  
  const { bucket_name } = useParams()
  

  return (
      <div className="bg-sky-100 min-h-screen flex items-center justify-center py-10">
        <div className="w-full max-w-3xl bg-sky-200 rounded-lg shadow-lg p-6">
          <h1 className="text-2xl font-bold text-sky-800 text-center mb-6">
            {bucket_name} Todo Lists ...
          </h1>  
          <ul className="space-y-6">
            {todoList.map((todo) => (
              <li className="p-4 bg-white rounded-lg shadow-md flex justify-between items-center hover:shadow-lg transition-shadow duration-300">
                <TodoList key={todo.id} todo={todo}/>  
              </li>
            ))}
          </ul>
        </div>
      </div>
    )
}

// todolist loader
const todoLoader = async ({params}) => {
  const res = await fetch(`http://localhost:8000/buckets/?name=${params.bucket_name}`)
  const data = await res.json();
  return data[0].todo_lists;
}

export { BucketPage as default, todoLoader} 
