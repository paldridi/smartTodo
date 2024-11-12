import axios from 'axios';

const smartTodoApi = axios.create({
    baseURL: 'http://localhost:8000'
});

// Retrieve all buckets with their todos
export const getBuckets = async () => {
    try {
        const res = await smartTodoApi.get('/buckets');
        return res.data;
    } catch (error) {
        console.error('Error fetching buckets:', error);
        return { error: error.message };
    }
};

// Add a new bucket
export const addBucket = async (bucketData) => {
    try {
        const res = await smartTodoApi.post('/buckets', bucketData);
        return res.data;
    } catch (error) {
        console.error('Error adding bucket:', error);
        return { error: error.message };
    }
};

// Add a new todo list item to a specific bucket
export const addTodoListToBucket = async (bucketId, newTodo) => {
    try {
        const res = await smartTodoApi.post(`/buckets/${bucketId}/todos`, newTodo);
        return res.data;
    } catch (error) {
        console.error('Error adding todo list to bucket:', error);
        return { error: error.message };
    }
};

// Delete a bucket
export const deleteBucket = async (bucketId) => {
    try {
        await smartTodoApi.delete(`/buckets/${bucketId}`);
    } catch (error) {
        console.error('Error deleting bucket:', error);
        return { error: error.message };
    }
};

// Delete a todo list item from a bucket
export const deleteTodoFromBucket = async (bucketId, todoId) => {
    try {
        await smartTodoApi.delete(`/buckets/${bucketId}/todos/${todoId}`);
    } catch (error) {
        console.error('Error deleting todo from bucket:', error);
        return { error: error.message };
    }
};

// Edit a bucket
export const editBucket = async (bucketId, updatedBucketData) => {
    try {
        const res = await smartTodoApi.patch(`/buckets/${bucketId}`, updatedBucketData);
        return res.data;
    } catch (error) {
        console.error('Error editing bucket:', error);
        return { error: error.message };
    }
};

// Edit a todo list item in a bucket
export const editTodoInBucket = async (bucketId, todoId, updatedTodo) => {
    try {
        const res = await smartTodoApi.patch(`/buckets/${bucketId}/todos/${todoId}`, updatedTodo);
        return res.data;
    } catch (error) {
        console.error('Error editing todo in bucket:', error);
        return { error: error.message };
    }
};
