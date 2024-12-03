// frontend/src/GlobalStyles.js

import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
  /* General body styling */
  body {
    background-color: ${({ theme }) => theme.body};
    color: ${({ theme }) => theme.text};
    font-family: Arial, sans-serif;
    margin: 0;
    padding: 0;
    transition: all 0.3s linear;
  }

  /* Dark mode specific class */
  .dark-mode {
    background-color: ${({ theme }) => theme.body};
    color: ${({ theme }) => theme.text};
  }

  /* Navbar, calendar, bucket, task components */
  .navbar, .calendar, .bucket, .task {
    transition: background-color 0.3s, color 0.3s;
  }

  /* Global link styling */
  a {
    color: ${({ theme }) => theme.link};
    text-decoration: none;
    transition: color 0.3s ease;
  }

  a:hover {
    color: ${({ theme }) => theme.linkHover};
  }

  /* Complete react-calendar styling for dark mode */
  .react-calendar {
    width: 100%;
    background-color: ${({ theme }) => theme.calendarBackground};
    color: ${({ theme }) => theme.calendarText};
    border: none;
    border-radius: 8px;
    box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
    transition: background-color 0.3s, color 0.3s;
  }

  /* Calendar month/year navigation buttons */
  .react-calendar__navigation button {
    background-color: ${({ theme }) => theme.tileBackground};
    color: ${({ theme }) => theme.tileText};
    border: none;
    border-radius: 4px;
    margin: 2px;
    padding: 0.5rem;
    font-weight: bold;
    transition: background-color 0.3s, color 0.3s;
  }

  .react-calendar__navigation button:hover {
    background-color: ${({ theme }) => theme.tileHoverBackground};
    color: ${({ theme }) => theme.tileHoverText};
  }

  /* Day tiles styling */
  .react-calendar__tile {
    background-color: ${({ theme }) => theme.tileBackground};
    color: ${({ theme }) => theme.tileText};
    border-radius: 4px;
    padding: 10px;
    transition: background-color 0.3s, color 0.3s;
  }

  /* Highlight the current date */
  .react-calendar__tile--now {
    background-color: ${({ theme }) => theme.tileCurrentBackground};
    color: ${({ theme }) => theme.tileCurrentText};
  }

  /* Highlight the selected date */
  .react-calendar__tile--active {
    background-color: ${({ theme }) => theme.tileActiveBackground};
    color: ${({ theme }) => theme.tileActiveText};
  }

  /* Weekend dates */
  .react-calendar__month-view__days__day--weekend {
    color: ${({ theme }) => theme.weekendText};
  }

  /* Disabled dates */
  .react-calendar__tile--disabled {
    background-color: ${({ theme }) => theme.disabledBackground};
    color: ${({ theme }) => theme.disabledText};
  }

  /* Calendar hover effects for day tiles */
  .react-calendar__tile:hover {
    background-color: ${({ theme }) => theme.tileHoverBackground};
    color: ${({ theme }) => theme.tileHoverText};
  }

  /* Button styling */
  button {
    background-color: ${({ theme }) => theme.buttonBackground};
    color: ${({ theme }) => theme.buttonText};
    border: none;
    border-radius: 5px;
    padding: 0.5rem 1rem;
    cursor: pointer;
    font-size: 1rem;
    transition: background-color 0.3s, color 0.3s;
  }

  button:hover {
    background-color: ${({ theme }) => theme.buttonHoverBackground};
    color: ${({ theme }) => theme.buttonHoverText};
  }

  /* Input fields styling */
  input[type="text"],
  input[type="date"],
  input[type="color"] {
    background-color: ${({ theme }) => theme.inputBackground};
    color: ${({ theme }) => theme.inputText};
    border: 1px solid ${({ theme }) => theme.inputBorder};
    border-radius: 5px;
    padding: 0.5rem;
    font-size: 1rem;
    transition: background-color 0.3s, color 0.3s, border-color 0.3s;
  }

  input[type="text"]:focus,
  input[type="date"]:focus,
  input[type="color"]:focus {
    border-color: ${({ theme }) => theme.inputFocusBorder};
  }

  /* Highlighted tiles in calendar */
  .highlight-tile {
    background-color: ${({ theme }) => theme.highlightBackground};
    color: ${({ theme }) => theme.highlightText};
    border-radius: 5px;
    transition: background-color 0.3s, color 0.3s;
  }
`;

export default GlobalStyles;
