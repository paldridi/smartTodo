// frontend/src/App.js

import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import GlobalStyles from './GlobalStyles';
import { lightTheme, darkTheme } from './theme';
import Navbar from './components/Navbar';
import BucketsPage from './pages/BucketsPage';
import TasksPage from './pages/TasksPage';
import CalendarPage from './pages/CalendarPage';
import AuthPage from './pages/AuthPage';
import axios from './api';

function App() {
  const [theme, setTheme] = useState('light');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check authentication and theme preference on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios
        .get('/theme', { headers: { Authorization: `Bearer ${token}` } })
        .then((response) => {
          setIsAuthenticated(true);
          if (response.data.value) setTheme(response.data.value);
        })
        .catch((error) => {
          console.error('Error fetching theme:', error);
          setIsAuthenticated(false);
          localStorage.removeItem('token');
          alert('Failed to authenticate. Please sign in again.');
        })
        .finally(() => setIsLoading(false));
    } else {
      setIsAuthenticated(false);
      setIsLoading(false);
    }
  }, []);

  // Toggle between light and dark themes
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);

    const token = localStorage.getItem('token');
    if (token) {
      axios
        .post(
          '/theme',
          { value: newTheme },
          { headers: { Authorization: `Bearer ${token}` } }
        )
        .then(() => console.log('Theme updated on server'))
        .catch((error) => console.error('Error updating theme:', error));
    }
  };

  // Function to handle login state
  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <ThemeProvider theme={theme === 'dark' ? darkTheme : lightTheme}>
      <GlobalStyles />
      <Router>
        <Navbar isAuthenticated={isAuthenticated} toggleTheme={toggleTheme} />
        <Routes>
          <Route
            path="/"
            element={
              isAuthenticated ? <BucketsPage /> : <Navigate to="/auth" />
            }
          />
          <Route
            path="/bucket/:id"
            element={
              isAuthenticated ? <TasksPage /> : <Navigate to="/auth" />
            }
          />
          <Route
            path="/calendar"
            element={
              isAuthenticated ? <CalendarPage /> : <Navigate to="/auth" />
            }
          />
          <Route path="/auth" element={<AuthPage onLogin={handleLogin} />} />
          <Route
            path="*"
            element={<Navigate to={isAuthenticated ? '/' : '/auth'} />}
          />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
