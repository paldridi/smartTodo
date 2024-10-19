import React, { Children } from 'react'
import MainLayout from './layouts/MainLayout'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import ErrorPage from './pages/ErrorPage';
import HomePage from './pages/HomePage';
import BucketPage, {todoLoader} from './pages/BucketPage';
import CalendarPage from './pages/CalendarPage';
import TodoPage from './pages/TodoPage';

const App = () => {
  
  // Pages Routes
  const router = createBrowserRouter([
    {
      path: '/',
      element: <MainLayout />,
      errorElement: <ErrorPage />,
      children: [
        {
          index: true,
          element: <HomePage />,
        },
        {
          path: ':bucket_name',
          element: <BucketPage />,
          loader: todoLoader,
          children: [
            {
              path: ':todo_id',
              element: <TodoPage />,
            }
          ]
        },
        {
          path: 'calendar',
          element: <CalendarPage />
        }
      ]
    }
  ])


  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}

export default App