import React, { useState, useEffect, useRef } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { gapi } from 'gapi-script';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { getBuckets } from '../api/smartTodoApi'; // Import the getBuckets function
import './CalendarPage.css'; // Import custom CSS

// Replace these with your actual Google API credentials
const CLIENT_ID = "255678950425-m0pntvhcvgbqvnarnkmonkmvncsnn034.apps.googleusercontent.com";
const API_KEY = "AIzaSyDD0S_JS61fuR7Ui-oKtYS84E7GRqFbkiE";
const SCOPES = "https://www.googleapis.com/auth/tasks.readonly";

// Utility to format dates in Eastern Time Zone
const toEasternDate = (dateStr) => {
  const date = new Date(dateStr);
  const options = { timeZone: 'America/New_York', year: 'numeric', month: '2-digit', day: '2-digit' };
  return new Date(new Intl.DateTimeFormat('en-US', options).format(date));
};

const CalendarPage = () => {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [googleTasks, setGoogleTasks] = useState([]);
  const [bucketTasks, setBucketTasks] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const calendarRef = useRef(null);

  // Initialize Google API client
  useEffect(() => {
    const initClient = () => {
      gapi.client.init({
        apiKey: API_KEY,
        clientId: CLIENT_ID,
        scope: SCOPES,
        discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/tasks/v1/rest'],
      }).then(() => {
        const authInstance = gapi.auth2.getAuthInstance();
        setIsSignedIn(authInstance.isSignedIn.get());
        authInstance.isSignedIn.listen(setIsSignedIn);
      }).catch(error => {
        console.error("Error initializing Google API client", error);
      });
    };

    gapi.load('client:auth2', initClient);
    fetchBucketTasks(); // Fetch bucket tasks
  }, []);

  // Fetch bucket tasks from your API
  const fetchBucketTasks = async () => {
    try {
      const data = await getBuckets();
      const formattedBucketTasks = data.flatMap(bucket =>
        bucket.todo_lists.map(todo => ({
          id: todo.id,
          title: todo.title,
          dueDate: toEasternDate(todo.deadline).toISOString().split('T')[0], // Convert to Eastern Time
          description: todo.description,
        }))
      );
      setBucketTasks(formattedBucketTasks);
    } catch (error) {
      console.error('Error fetching bucket tasks:', error);
    }
  };

  const handleSignIn = () => {
    gapi.auth2.getAuthInstance().signIn();
  };

  const handleSignOut = () => {
    gapi.auth2.getAuthInstance().signOut();
    setGoogleTasks([]);
  };

  const fetchGoogleTasks = async () => {
    const tasks = await gapi.client.tasks.tasks.list({
      tasklist: '@default',
      showCompleted: false,
    });
    const googleTasks = tasks.result.items.map(task => ({
      id: task.id,
      title: task.title,
      dueDate: task.due ? toEasternDate(task.due).toISOString().split('T')[0] : null, // Convert to Eastern Time
    }));
    setGoogleTasks(googleTasks);
  };

  const syncTasks = () => {
    if (isSignedIn) {
      fetchGoogleTasks();
    }
    fetchBucketTasks(); // Re-fetch bucket tasks
  };

  const events = [
    ...googleTasks.map(task => ({
      id: task.id,
      title: task.title,
      start: task.dueDate,
      color: '#FF0000', // Red color for Google tasks
    })),
    ...bucketTasks.map(task => ({
      id: task.id,
      title: task.title,
      start: task.dueDate,
      color: '#0F9D58', // Green color for bucket tasks
    })),
  ];

  const handleDateClick = (info) => {
    // Adjust the clicked date to Eastern Time
    const clickedDate = new Date(info.dateStr + "T00:00:00");
    const easternDate = new Date(clickedDate.toLocaleString("en-US", { timeZone: "America/New_York" }));
    easternDate.setHours(0, 0, 0, 0); // Set to midnight to avoid time zone shift
  
    setSelectedDate(easternDate);
  };
  

  const handleMiniCalendarChange = (date) => {
    setSelectedDate(date);
    const calendarApi = calendarRef.current.getApi();
    calendarApi.gotoDate(date); // Update FullCalendar view based on the small calendar
  };

  // Tile content for small calendar to show red dot for Google tasks and green dot for bucket tasks
  const tileContent = ({ date, view }) => {
    if (view === 'month') {
      const formattedDate = toEasternDate(date).toISOString().split('T')[0];

      const hasGoogleTask = googleTasks.some(task => task.dueDate === formattedDate);
      const hasBucketTask = bucketTasks.some(task => task.dueDate === formattedDate);

      return (
        <div>
          {hasGoogleTask && <span style={{ color: 'red', fontSize: '20px' }}>•</span>}
          {hasBucketTask && <span style={{ color: 'green', fontSize: '20px', marginLeft: '5px' }}>•</span>}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="calendar-page" style={{ display: 'flex', gap: '20px', padding: '20px', height: 'calc(100vh - 80px)' }}>
      {/* FullCalendar */}
      <div className="primary-calendar" style={{ flex: 3, height: '100%' }}>
        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay',
          }}
          events={events}
          timeZone="America/New_York" // Set time zone to Eastern Time
          dateClick={handleDateClick}
          height="100%"
        />
      </div>

      {/* Sidebar with Mini Calendar and Task List */}
      <div className="sidebar" style={{ flex: 1, height: '100%' }}>
        {/* Small Calendar */}
        <Calendar onChange={handleMiniCalendarChange} value={selectedDate} tileContent={tileContent} />

        {/* Sign In/Out and Sync Buttons */}
        <div className="button-group">
          <button onClick={isSignedIn ? handleSignOut : handleSignIn} className="sync-button">
            {isSignedIn ? "Sign Out of Google" : "Sign In with Google"}
          </button>
          {isSignedIn && (
            <button onClick={syncTasks} className="sync-button">
              Sync with Google Tasks
            </button>
          )}
        </div>

        {/* Task List */}
        <div className="task-list" style={{ marginTop: '20px' }}>
          <h3>Tasks on {selectedDate.toDateString()}</h3>
          <ul>
            {googleTasks.filter(task => task.dueDate === selectedDate.toISOString().split('T')[0]).map(task => (
              <li key={task.id} style={{ color: 'red' }}>
                {task.title} - Due: {task.dueDate}
              </li>
            ))}
            {bucketTasks.filter(task => task.dueDate === selectedDate.toISOString().split('T')[0]).map(task => (
              <li key={task.id} style={{ color: 'green' }}>
                {task.title} - Due: {task.dueDate}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CalendarPage;