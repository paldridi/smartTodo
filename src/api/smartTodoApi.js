import axios from 'axios';

const smartTodoApi = axios.create({
    baseURL: 'http://localhost:8000'
})

// retrieve all buckets
export const getBuckets = async () => {
    try {
        const res = await smartTodoApi.get('/buckets')
        await new Promise(resolve => setTimeout(resolve, 2000))
        console.log('res data',res.data)
        return res.data
    } catch (error) {
        console.error('Error fetching buckets:', error)
        return { error: error.message }
    }
}

// add bucket
export const addBucket = async (bucketData) => {
    try {
        const res = await smartTodoApi.post('/buckets', bucketData)
        return res.data
    } catch (error) {
        console.error('Error fetching buckets:', error)
        return { error: error.message }
    }
}

// add a new todo list to a specific bucket
export const addTodoListToBucket = async (bucketId, todoListData) => {
    try {
        const res = await smartTodoApi.post(`/buckets/${bucketId}/todolist`, todoListData);
        return res.data;
    } catch (error) {
        console.error('Error fetching buckets:', error)
        return { error: error.message }
    }
  };

// delete a bucket
export const deleteBucket = async (bucketId) => {
    try {
        await smartTodoApi.delete(`/buckets/${bucketId}`);
    } catch (error) {
        console.error('Error fetching buckets:', error)
        return { error: error.message }
    }
  };

// delete a todo list from a bucket
export const deleteTodoListFromBucket = async (bucketId, todoListId) => {
    try {
        await smartTodoApi.delete(`/buckets/${bucketId}/todolist/${todoListId}`);
    } catch (error) {
        console.error('Error fetching buckets:', error)
        return { error: error.message }
    }
  };

  // edit a bucket
export const editBucket = async (bucketId, updatedBucketData) => {
    try {
        const res = await smartTodoApi.put(`/buckets/${bucketId}`, updatedBucketData);
        return res.data;
    } catch (error) {
        console.error('Error fetching buckets:', error)
        return { error: error.message }
    }
  };
  
  // edit a todo list in a bucket
  export const editTodoListInBucket = async (bucketId, todoListId, updatedTodoListData) => {
    try {
        const res = await smartTodoApi.put(`/buckets/${bucketId}/todolist/${todoListId}`, updatedTodoListData);
        return res.data;
    } catch (error) {
        console.error('Error fetching buckets:', error)
        return { error: error.message }
    }
  };