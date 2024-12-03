
import { useEffect, useState } from 'react';
import Spinner from '../components/Spinner';
import Buckets from '../components/Buckets';
import Modal from '../components/ModalBucket';
import { AiOutlinePlus } from 'react-icons/ai';
import { getBuckets } from '../api/smartTodoApi';

const HomePage = () => {

  const [buckets, setBuckets] = useState([]); // Initialize as an empty array
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setModalOpen] = useState(false);

  // Fetch data from API
  useEffect(() => {
    const fetchBuckets = async () => {
      try {
        const result = await getBuckets();
        console.log("Buckets API Response:", result);  // Log the result here
        setBuckets(result);  // Set the fetched data to buckets
      } catch (error) {
        console.log('Error fetching data', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBuckets();
  }, []);


  return (
    <section className='bg-purple-50 px-4 py-10 relative'> 
      <div className='container-xl lg:container m-auto'>
      {loading ? (
            <Spinner loading={loading} />
          ) : (
            <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>

              {Array.isArray(buckets) && buckets.map((bucket) => (

                <Buckets key={bucket.id} bucket={bucket} />
              ))}
            </div>
          )}
      </div>

      <button 
        className="absolute bottom-1 right-4 bg-purple-600 text-white rounded-full p-2 shadow-md hover:bg-purple-700 transition duration-300 flex items-center justify-center"
        onClick={() => setModalOpen(true)}
      >
        <AiOutlinePlus size={24} />
      </button>


      <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)} bucketLength={buckets.length}/>
    </section>
  );
};


export default HomePage;
