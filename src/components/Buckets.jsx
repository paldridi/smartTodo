import { useNavigate } from "react-router-dom";

// Bucket card that recieves a bucket prop
const Buckets = ({ bucket}) => {
    const navigate = useNavigate();

    const handleBucketClick = () => {
        navigate(`/buckets/${bucket.name}`); // progmatically navigate to the bucket todos
    };

    return (
        <div
            onClick={handleBucketClick}
            className="bg-sky-200 hover:bg-sky-300 transition-colors duration-300 cursor-pointer p-6 rounded-lg shadow-md text-center"
        >
            <h2 className="text-xl font-semibold text-sky-800">{bucket.name}</h2>
        </div>
    )
    }

export default Buckets;
