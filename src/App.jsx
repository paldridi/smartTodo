import React from 'react'
import MainLayout from './layouts/MainLayout'
import { Route, createBrowserRouter, createRoutesFromElements, RouterProvider } from 'react-router-dom';
import ErrorPage from './pages/ErrorPage';
import HomePage from './pages/HomePage';
import BucketPage from './pages/BucketPage';
import CalendarPage from './pages/CalendarPage';
import TodoPage from './pages/TodoPage';

const App = () => {
  
  // Pages Routes
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path='/' element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route path='/buckets/:bucket_name' element={<BucketPage />}>
          <Route path=':todo_id' element={<TodoPage />}/>
        </Route>
        <Route path='/calendar' element={CalendarPage}/>
        <Route path='*' element={<ErrorPage />} />
      </Route>
    )
  );


  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}

export default App