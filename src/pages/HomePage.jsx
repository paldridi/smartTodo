import { useEffect, useState } from 'react';
import Spinner from '../components/Spinner';
import Buckets from '../components/Buckets';

const HomePage = () => {
  const [buckets, setBuckets] = useState([])
  const [loading, setLoading] = useState(true)

  // API get call for all data from backend
  useEffect(() => {
    const fetchBuckets = async () => {
      try {
        const res = await fetch('http://localhost:8000/buckets')
        const data = await res.json();  
        
        // simulate a request delay
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        console.log(data)
        setBuckets(data)
      } catch (error) {
        console.log('Error fetching data', error);
      } finally {
        setLoading(false)
      }   
    }

    fetchBuckets()
  }, [])

  return (
    <section className='bg-purple-50 px-4 py-10'> 
      <div className='container-xl lg:container m-auto'>
      {loading ? (
            <Spinner loading={loading} />
          ) : (
            <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
              {buckets.map((bucket) => (
                <Buckets key={bucket.id} bucket={bucket} />
              ))}
            </div>
          )}
      </div>
    </section>

  )
}

export default HomePage
