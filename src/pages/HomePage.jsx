import bucketData from './../buckets.json';
import Buckets from '../components/Buckets';

const HomePage = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
        {bucketData.buckets.map((bucket) => (
            <Buckets key={bucket.id} bucket={bucket} />
        ))}

    </div>
  )
}

export default HomePage
