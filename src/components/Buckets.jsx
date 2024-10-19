
import { Link } from "react-router-dom";

// Bucket card that recieves a bucket prop
const Buckets = ({ bucket }) => {

    return (
        <div
            className="bg-sky-200 hover:bg-sky-300 transition-colors duration-300 cursor-pointer p-6 px-3 rounded-lg shadow-md text-center relative"
        >
            <Link to={`/${bucket.name}`}>
            <h2 className="text-xl font-semibold text-sky-800">{bucket.name}</h2>
            </Link>
        </div>
    )
    }

export default Buckets;
