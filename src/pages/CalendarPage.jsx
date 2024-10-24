import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import axios from 'axios';

// Sample API data retrieval function
const fetchData = async () => {
    try {
        const res = await axios.get('http://localhost:8000/buckets'); // Fetch buckets and tasks from API
        return res.data;
    } catch (error) {
        console.error('Error fetching data:', error);
        return [];
    }
};

const CalendarPage = () => {
    const [value, setValue] = useState(new Date());
    const [selectedTodos, setSelectedTodos] = useState([]);
    const [buckets, setBuckets] = useState([]);

    // Fetch the bucket data on component mount
    React.useEffect(() => {
        const loadData = async () => {
            const data = await fetchData();
            setBuckets(data);
        };
        loadData();
    }, []);

    // Function to handle date selection and display associated to-dos
    const onChange = (date) => {
        setValue(date);
        const formattedDate = date.toISOString().split('T')[0]; // Format the date for matching deadlines

        // Filter to-do items based on selected date
        const todosForSelectedDate = buckets.flatMap(bucket => 
            bucket.todo_lists.filter(todo => todo.deadline.startsWith(formattedDate))
        );

        setSelectedTodos(todosForSelectedDate);
    };

    // Function to mark dates with deadlines
    const tileContent = ({ date }) => {
        const formattedDate = date.toISOString().split('T')[0];

        // Check if any task has a deadline matching the current date
        const hasDeadline = buckets.some(bucket =>
            bucket.todo_lists.some(todo => todo.deadline.startsWith(formattedDate))
        );

        return hasDeadline ? <div className="deadline-marker" style={{ color: 'red' }}>•</div> : null;
    };

    return (
        <div style={{ margin: 'auto', width: 'fit-content', padding: '50px' }}>
            <h2>Select a Date</h2>
            <Calendar
                onChange={onChange}
                value={value}
                tileContent={tileContent}
            />
            <div>
                <h3>To-Do List for {value.toDateString()}</h3>
                {selectedTodos.length > 0 ? (
                    <ul>
                        {selectedTodos.map((todo) => (
                            <li key={todo.id}>
                                <strong>{todo.title}</strong> - {todo.description} (Due: {new Date(todo.deadline).toDateString()})
                                <br />
                                <strong>Status: </strong>{todo.done ? 'Completed' : 'Pending'}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No tasks for this date.</p>
                )}
            </div>
        </div>
    );
};

export default CalendarPage;
