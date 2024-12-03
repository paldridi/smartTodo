import React, { useState, useEffect, useCallback } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import api from '../api';
import { gapi } from 'gapi-script';
import './CalendarView.css';

const CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;
const API_KEY = process.env.REACT_APP_GOOGLE_API_KEY;
const SCOPES = process.env.REACT_APP_GOOGLE_SCOPES;

const CalendarPage = () => {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [accessToken, setAccessToken] = useState(localStorage.getItem('accessToken') || '');
  const [googleTasks, setGoogleTasks] = useState([]);
  const [googleCalendarEvents, setGoogleCalendarEvents] = useState([]);
  const [localTasks, setLocalTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Fetch Google Tasks
  const fetchGoogleTasks = useCallback(() => {
    if (!accessToken) return;

    setIsLoading(true); // Start loading
    gapi.client.tasks.tasks
      .list({
        tasklist: '@default',
        showCompleted: true,
      })
      .then((response) => {
        const tasks = response.result.items || [];
        setGoogleTasks(
          tasks.map((task) => ({
            title: `Task from Google: ${task.title}`, // Prepend the label for clarity
            start: task.due || task.updated,
            // Use a consistent color only if the task doesn't already have one
            color: task.color || '#4CAF50',
            extendedProps: { 
              description: task.notes || '', // Include task description
              status: task.status || 'incomplete' },
          }))
        );
        setIsLoading(false); // End loading on success
      })
      .catch((error) => {
        console.error('Error fetching Google Tasks:', error);
        setErrorMessage('Failed to fetch Google Tasks.');
        setIsLoading(false); // End loading on error
      });
  }, [accessToken]);

  // Fetch Google Calendar Events
  const fetchGoogleCalendarEvents = useCallback(() => {
    if (!accessToken) return;

    setIsLoading(true); // Start loading
    gapi.client.calendar.events
      .list({
        calendarId: 'primary',
        timeMin: new Date().toISOString(),
        showDeleted: false,
        singleEvents: true,
        maxResults: 100,
        orderBy: 'startTime',
      })
      .then((response) => {
        const events = response.result.items || [];
        setGoogleCalendarEvents(
          events.map((event) => ({
            title: event.summary,
            start: event.start.dateTime || event.start.date,
            end: event.end.dateTime || event.end.date,
            color: '#FF5722', // Consistent color for calendar events
          }))
        );
        setIsLoading(false); // End loading on success
      })
      .catch((error) => {
        console.error('Error fetching Google Calendar events:', error);
        setErrorMessage('Failed to fetch Google Calendar events.');
        setIsLoading(false); // End loading on error
      });
  }, [accessToken]);

  // Fetch Local Tasks from Backend
const fetchLocalTasks = useCallback(async () => {
  console.log("Fetching Local Tasks...");
  setIsLoading(true);
  try {
    const response = await api.get('/tasks');
    setLocalTasks(
      response.data.map((task) => ({
        title: task.title,
        start: task.deadline,
        color: task.color || task.bucket?.color || '#1976d2', // Use the bucket color or a default color
        extendedProps: {
          bucketName: task.bucket?.name || 'Uncategorized', // For task list display
          description: task.description || '', // Add description for task list
        },
      }))
    );
    setIsLoading(false);
  } catch (error) {
    console.error('Error fetching local tasks:', error);
    setErrorMessage('Failed to fetch local tasks.');
    setIsLoading(false);
  }
}, []);


  // Initialize Google API client
  useEffect(() => {
    const initializeGapiClient = () => {
      console.log("Initializing Google API client...");
      gapi.client
        .init({
          apiKey: API_KEY,
          clientId: CLIENT_ID,
          scope: SCOPES,
          discoveryDocs: [
            'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest',
            'https://www.googleapis.com/discovery/v1/apis/tasks/v1/rest',
          ],
        })
        .then(() => {
          const authInstance = gapi.auth2.getAuthInstance();
          setIsSignedIn(authInstance.isSignedIn.get());
          const token = authInstance.currentUser.get().getAuthResponse().access_token;
          setAccessToken(token);
          localStorage.setItem('accessToken', token);

          // Fetch tasks and events
          fetchGoogleTasks();
          fetchGoogleCalendarEvents();
          fetchLocalTasks();
        })
        .catch((error) => {
          console.error('Error initializing Google API client:', error);
          setErrorMessage('Failed to initialize Google API client.');
        });
    };

    gapi.load('client:auth2', initializeGapiClient);
  }, [fetchGoogleTasks, fetchGoogleCalendarEvents, fetchLocalTasks]);

  // Handle Google Sign-In
  const handleSignIn = () => {
    const auth2 = gapi.auth2.getAuthInstance();
    auth2.signIn().then(() => {
      const token = auth2.currentUser.get().getAuthResponse().access_token;
      setAccessToken(token);
      setIsSignedIn(true);
      localStorage.setItem('accessToken', token);

      fetchGoogleTasks();
      fetchGoogleCalendarEvents();
    });
  };

  // Handle Google Sign-Out
  const handleSignOut = () => {
    const auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(() => {
      setIsSignedIn(false);
      setAccessToken('');
      setGoogleTasks([]);
      setGoogleCalendarEvents([]);
      setLocalTasks([]);
      localStorage.removeItem('accessToken');
    });
  };

  return (
    <div className="calendar-page">
      {errorMessage && <div className="error-message">{errorMessage}</div>}
      {isLoading && <div className="loading-spinner">Loading...</div>}

      <div className="main-layout">
        {/* Large Calendar for Google Tasks */}
        <div className="large-calendar-container">
          <FullCalendar
            plugins={[dayGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            events={[...localTasks, ...googleTasks]}
          />
        </div>

        {/* Sidebar */}
        <div className="sidebar">
          {/* Small Calendar for Google Calendar Events */}
          <div className="small-calendar-container">
            <FullCalendar
              plugins={[dayGridPlugin]}
              initialView="dayGridMonth"
              events={googleCalendarEvents}
              headerToolbar={{
                left: 'title',
                right: 'prev,next',
              }}
              height="auto"
            />
          </div>

          {/* Sign-In/Sign-Out Buttons */}
          <div className="actions">
            {!isSignedIn ? (
              <button onClick={handleSignIn} className="btn">Sign In with Google</button>
            ) : (
              <button onClick={handleSignOut} className="btn btn-signout">Sign Out</button>
            )}
            <button
              onClick={() => {
                fetchGoogleTasks();
                fetchGoogleCalendarEvents();
              }}
              className="btn"
            >
              Sync with Google
            </button>
          </div>

          {/* Task List */}
          <div className="task-list">
            <h3>Task List</h3>
            {[...googleTasks, ...localTasks]
              .filter((task) => new Date(task.start) >= new Date()) // Only future tasks
              .map((task, index) => (
                <div key={index} className="task-item" style={{ backgroundColor: task.color }}>
                  <strong>{task.title}</strong>
                  <p>Due: {new Date(task.start).toLocaleDateString()}</p>
                  {task.extendedProps?.description && <p>{task.extendedProps.description}</p>}
                </div>
              ))}
          </div>


        </div>
      </div>
    </div>
  );
};

export default CalendarPage;
