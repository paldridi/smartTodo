// import React from 'react'

// const CalendarPage = () => {
//   return (
//     <div>
//       This is the calendar page
//     </div>
//   )
// }

// export default CalendarPage

import React, { useState } from 'react';
import { GoogleOAuthProvider, GoogleLogin, googleLogout } from '@react-oauth/google';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { tasks } from './TodoPage';  // Import tasks from TodoPage.jsx

const CalendarPage = () => {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [value, setValue] = useState(new Date());

  // Function to handle sign-out
  const handleLogout = () => {
    googleLogout();
    setIsSignedIn(false);
    setUserInfo(null);
  };

  // Function to display tasks on the selected date
  const renderTasks = (date) => {
    const taskForDate = tasks.filter(task => new Date(task.date).toDateString() === date.toDateString());
    return taskForDate.map((task, index) => (
      <div key={index} style={{ marginBottom: '20px' }}>
        <h3>{task.title}</h3>
        <p>{task.time}</p>
        <p>{task.description}</p>
      </div>
    ));
  };
  

  return (
    <GoogleOAuthProvider clientId="255678950425-m0pntvhcvgbqvnarnkmonkmvncsnn034.apps.googleusercontent.com">
      <div>
        <h1>Task Calendar</h1>
        {!isSignedIn ? (
          <GoogleLogin
            onSuccess={(credentialResponse) => {
              console.log(credentialResponse);
              setIsSignedIn(true);
              setUserInfo(credentialResponse);
            }}
            onError={() => {
              console.log('Login Failed');
            }}
          />
        ) : (
          <div>
            <button onClick={handleLogout}>Sign Out</button>
            <h2>Welcome, {userInfo?.profileObj?.name}</h2>
          </div>
        )}
  
        {isSignedIn && (
          <div style={{ display: 'flex' }}>
            <div style={{ flex: '1', maxWidth: '600px' }}> {/* Make the calendar larger */}
              <Calendar onChange={setValue} value={value} />
            </div>
  
            <div style={{ flex: '1', paddingLeft: '20px' }}>
              <h2>Tasks for {value.toDateString()}</h2>
              <div>{renderTasks(value)}</div>
            </div>
          </div>
        )}
      </div>
    </GoogleOAuthProvider>
  );
};

export default CalendarPage;
