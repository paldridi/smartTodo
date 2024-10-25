import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { gapi } from 'gapi-script';
import '../index.css'; // Import global CSS for styling

const CLIENT_ID = "_YOUR_CLIENT_ID_";  // Replace with your client ID
const API_KEY = "AIzaSyDD0S_JS61fuR7Ui-oKtYS84E7GRqFbkiE";  // Replace with your API key
const SCOPES = "https://www.googleapis.com/auth/tasks";

const CalendarPage = () => {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [accessToken, setAccessToken] = useState(localStorage.getItem('accessToken') || '');
  const [value, setValue] = useState(new Date());
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [taskLists, setTaskLists] = useState([]);
  const [gapiLoaded, setGapiLoaded] = useState(false);

  // New state for adding tasks
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskNotes, setNewTaskNotes] = useState('');
  const [newTaskTime, setNewTaskTime] = useState('');
  const [isAllDay, setIsAllDay] = useState(false); // Checkbox state for "All Day"

  // Initialize Google API client on component mount
  useEffect(() => {
    const initClient = () => {
      gapi.client.init({
        apiKey: API_KEY,
        clientId: CLIENT_ID,
        scope: SCOPES,
        discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/tasks/v1/rest'],
      }).then(() => {
        const authInstance = gapi.auth2.getAuthInstance();
        setGapiLoaded(true);  // Indicate that gapi has loaded

        // Check if the user is already signed in
        if (authInstance.isSignedIn.get() || accessToken) {
          setIsSignedIn(true);
          if (!accessToken) {
            const token = authInstance.currentUser.get().getAuthResponse().access_token;
            setAccessToken(token);
            localStorage.setItem('accessToken', token);
          }
          listTaskLists(accessToken || authInstance.currentUser.get().getAuthResponse().access_token);
        }
      }).catch(err => {
        console.error('Error initializing GAPI client:', err);
      });
    };

    gapi.load('client:auth2', initClient);
  }, [accessToken]);

  // Handle Google sign-in
  const handleSignIn = () => {
    if (gapiLoaded) {
      const auth2 = gapi.auth2.getAuthInstance();
      auth2.signIn().then(() => {
        const token = auth2.currentUser.get().getAuthResponse().access_token;
        setAccessToken(token);
        setIsSignedIn(true);
        localStorage.setItem('accessToken', token);
        listTaskLists(token);
      }).catch(err => {
        console.error('Error during sign-in:', err);
      });
    } else {
      console.error('GAPI not loaded yet.');
    }
  };

  // Handle Google sign-out
  const handleSignOut = () => {
    const auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(() => {
      setIsSignedIn(false);
      setAccessToken('');
      setTasks([]);
      localStorage.removeItem('accessToken');
      console.log('User signed out.');
    }).catch(err => {
      console.error('Error during sign-out:', err);
    });
  };

  // Fetch the list of task lists
  const listTaskLists = (token) => {
    gapi.client.setToken({ access_token: token });

    gapi.client.tasks.tasklists.list().then((response) => {
      const taskLists = response.result.items || [];
      setTaskLists(taskLists);

      if (taskLists.length > 0) {
        fetchTasksForSelectedDay(taskLists[0].id, token); // Fetch tasks from the first task list
      }
    }).catch((error) => {
      console.error('Error fetching task lists:', error);
    });
  };

  // Fetch tasks for the selected day
  const fetchTasksForSelectedDay = (taskListId, token) => {
    setLoading(true);

    const startOfDay = new Date(value);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(value);
    endOfDay.setHours(23, 59, 59, 999);

    gapi.client.tasks.tasks.list({
      tasklist: taskListId,
      showDeleted: false,
      showHidden: false,
    }).then((response) => {
      const allTasks = response.result.items || [];
      const filteredTasks = allTasks.filter((task) => {
        const dueDate = task.due ? new Date(task.due) : null;
        return dueDate && dueDate >= startOfDay && dueDate <= endOfDay;
      });

      setTasks(filteredTasks);
      setLoading(false);
    }).catch((error) => {
      console.error('Error fetching tasks:', error);
      setLoading(false);
    });
  };

  // Handle marking a task as complete
  const handleTaskComplete = (taskListId, task) => {
    gapi.client.tasks.tasks.patch({
      tasklist: taskListId,
      task: task.id,
      resource: { status: 'completed' },
    }).then(() => {
      setTasks(prevTasks => prevTasks.map(t => t.id === task.id ? { ...t, status: 'completed' } : t));
      console.log(`Task "${task.title}" marked as complete.`);
    }).catch((error) => {
      console.error('Error marking task as complete:', error);
    });
  };

  // Handle adding a new task with a due time or as "All Day"
  const handleAddTask = () => {
    if (!newTaskTitle.trim()) {
      alert('Task title cannot be empty!');
      return;
    }

    const taskListId = taskLists[0]?.id;
    if (!taskListId) {
      alert('No task list found!');
      return;
    }

    // Set the due date with or without time based on "All Day" selection
    let dueDateTime = new Date(value);

    if (!isAllDay && newTaskTime) {
      // If "All Day" is not checked, use the specified time
      const [hours, minutes] = newTaskTime.split(':');
      dueDateTime.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0);
    } else {
      // If "All Day" is checked, set to midnight
      dueDateTime.setHours(0, 0, 0, 0);
    }

    const newTask = {
      title: newTaskTitle,
      notes: newTaskNotes,
      due: dueDateTime.toISOString(),
    };

    gapi.client.tasks.tasks.insert({
      tasklist: taskListId,
      resource: newTask,
    }).then((response) => {
      console.log('New Task Added:', response.result);
      setTasks([...tasks, response.result]);
      setNewTaskTitle('');
      setNewTaskNotes('');
      setNewTaskTime('');
      setIsAllDay(false); // Reset the "All Day" checkbox
    }).catch((error) => {
      console.error('Error adding new task:', error);
    });
  };

  // Handle date change in calendar
  const handleDateChange = (newDate) => {
    setValue(newDate);
    if (isSignedIn && accessToken && taskLists.length > 0) {
      fetchTasksForSelectedDay(taskLists[0].id, accessToken);
    }
  };

  // Handle resync of tasks
  const handleResync = () => {
    if (isSignedIn && accessToken && taskLists.length > 0) {
      fetchTasksForSelectedDay(taskLists[0].id, accessToken);
    }
  };

  return (
    <div>
      <h1>Task Manager</h1>
      {!isSignedIn ? (
        <button onClick={handleSignIn} className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700">
          Sign In with Google
        </button>
      ) : (
        <div>
          <button onClick={handleSignOut} className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-700">
            Sign Out
          </button>
          <Calendar onChange={handleDateChange} value={value} />
          <button onClick={handleResync} className="bg-green-500 text-white py-2 px-4 mt-2 rounded hover:bg-green-700">
            Resync Tasks
          </button>
          <div className="mt-4">
            <h2>Add New Task</h2>
            <input
              type="text"
              placeholder="Task Title"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              className="border p-2 mt-2 w-full"
            />
            <textarea
              placeholder="Task Notes"
              value={newTaskNotes}
              onChange={(e) => setNewTaskNotes(e.target.value)}
              className="border p-2 mt-2 w-full"
            ></textarea>
            <div className="mt-2">
              <input
                type="checkbox"
                checked={isAllDay}
                onChange={() => setIsAllDay(!isAllDay)}
                className="mr-2"
              />
              <label>All Day</label>
            </div>
            {!isAllDay && (
              <input
                type="time"
                value={newTaskTime}
                onChange={(e) => setNewTaskTime(e.target.value)}
                className="border p-2 mt-2 w-full"
              />
            )}
            <button
              onClick={handleAddTask}
              className="bg-blue-500 text-white py-2 px-4 mt-2 rounded hover:bg-blue-700"
            >
              Add Task
            </button>
          </div>
          <h2>Tasks for {value.toLocaleDateString()}</h2>
          {loading ? (
            <p>Loading tasks...</p>
          ) : tasks.length === 0 ? (
            <p>No tasks found for the selected day.</p>
          ) : (
            tasks.map((task, index) => (
              <div key={index} className="border p-2 mt-2">
                <input
                  type="checkbox"
                  checked={task.status === 'completed'}
                  onChange={() => handleTaskComplete(taskLists[0].id, task)}
                />
                <h3>{task.title || 'No Title'}</h3>
                <p>Due: {task.due ? new Date(task.due).toLocaleString() : 'No due date'}</p>
                <p>{task.notes || 'No notes available'}</p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default CalendarPage;
