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
        const res = await smartTodoApi.patch(`/buckets/${bucketId}`, {
            todo_lists: todoListData, 
        });
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
        const res = await smartTodoApi.patch(`/buckets/${bucketId}`, updatedBucketData);
    } catch (error) {
        console.error('Error fetching buckets:', error)
        return { error: error.message }
    }
  };
  
  // edit a todo list in a bucket
  export const editTodoListInBucket = async (bucketId, todoId, updatedTodo) => {
    try {
        const bucketResponse = await smartTodoApi.get(`/buckets/${bucketId}`)
        const bucket = bucketResponse.data;
        let todoFound = false;

        const todoList = bucket.todo_lists[0]; // Access the first (and only) todo list

        //  Find the todo item to update
        const todoIndex = todoList.findIndex(todo => todo.id === todoId);
        if (todoIndex !== -1) {
            // Step 4: Merge the existing todo with the updated data
            todoList[todoIndex] = {
                ...todoList[todoIndex],
                ...updatedTodo
            };
            todoFound = true;
        }

        if (!todoFound) {
            throw new Error('Todo item not found');
        }

        console.log(bucket)
        
        // const res = await smartTodoApi.put(`/buckets/${bucketId}`, updatedTodoList);
    } catch (error) {
        console.error('Error fetching buckets:', error)
        return { error: error.message }
    }
  };