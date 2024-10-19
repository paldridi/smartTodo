import React from 'react'
import { Link, useRouteError } from "react-router-dom";

const ErrorPage = () => {
    const error = useRouteError();
    console.error(error);
  
    return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-sky-50">
      <div className="bg-white shadow-lg rounded-lg p-10 border-l-4 border-red-500">
        <h1 className="text-6xl font-bold text-red-600 mb-4">Oops!</h1>
        <p className="text-2xl font-semibold text-sky-700 mb-2">Sorry, an unexpected error has occurred.</p>
        <p className="text-gray-500 mb-6">
          <i>{error.statusText || error.message}</i>
        </p>
        <Link to="/"
          className="px-6 py-3 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition-colors"
        >
          Go Back Home
        </Link>
      </div>
    </div>
  )
}

export default ErrorPage
