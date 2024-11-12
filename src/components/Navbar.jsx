import { FaHome } from 'react-icons/fa'
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <>
      <nav className="bg-blue-500 p-4 shadow-md">
        <div className="container mx-auto flex items-center justify-between">
            <div className="flex items-center">
            <Link to="/" className="text-white text-lg font-bold">
                <FaHome className="text-2xl" />
            </Link>
            </div>
            <div className="space-x-6 text-white text-lg">
            <Link to="/" className="hover:underline">
                Buckets
            </Link>
            <Link to="/calendar" className="hover:underline">
                Calendar
            </Link>
            </div>
        </div>
      </nav>
    </>
  )
}

export default Navbar
