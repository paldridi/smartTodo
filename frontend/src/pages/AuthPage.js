// frontend/src/pages/AuthPage.js

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api';
import styled, { keyframes, useTheme } from 'styled-components';

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const AuthContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 3rem;
  animation: ${fadeIn} 0.6s ease;
`;

const AuthForm = styled.form`
  display: flex;
  flex-direction: column;
  width: 320px;
  gap: 1rem;
  background-color: ${({ theme }) => theme.body};
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.15);
  transition: background-color 0.3s ease;
`;

const Input = styled.input`
  padding: 0.7rem;
  background-color: ${({ theme }) => theme.inputBackground};
  color: ${({ theme }) => theme.inputText};
  border: 1px solid ${({ theme }) => theme.inputBorder};
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s, background-color 0.3s, color 0.3s;

  &:focus {
    border-color: ${({ theme }) => theme.inputFocusBorder};
  }
`;

const Button = styled.button`
  padding: 0.7rem;
  background-color: ${({ isSignUp, theme }) => (isSignUp ? '#4caf50' : theme.buttonBackground)};
  color: ${({ theme }) => theme.buttonText};
  font-size: 1rem;
  font-weight: bold;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.2s ease;

  &:hover {
    background-color: ${({ isSignUp, theme }) => (isSignUp ? '#388e3c' : theme.buttonHoverBackground)};
    transform: translateY(-2px);
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
  }
`;

const SwitchText = styled.p`
  text-align: center;
  color: ${({ theme }) => theme.text};
  cursor: pointer;
  font-size: 0.9rem;
  margin-top: 1rem;
  transition: color 0.3s;

  &:hover {
    color: ${({ theme }) => theme.linkHover};
  }
`;

const MessageContainer = styled.div`
  width: 320px;
  text-align: center;
  font-size: 0.9rem;
  color: ${({ isError, theme }) => (isError ? '#e53935' : theme.text)};
  background-color: ${({ isError, theme }) => (isError ? '#ffebee' : theme.highlightBackground)};
  border: 1px solid ${({ isError }) => (isError ? '#e53935' : '#4caf50')};
  border-radius: 8px;
  padding: 0.5rem;
  margin-top: 1rem;
  animation: ${fadeIn} 0.5s ease;
`;

function AuthPage({ onLogin }) {
  const theme = useTheme();
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    password: '',
    email: '',
  });
  const [message, setMessage] = useState({ text: '', isError: false });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setMessage({ text: '', isError: false });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = isSignUp ? '/auth/signup' : '/auth/signin';

    try {
      const response = await axios.post(endpoint, formData);

      if (isSignUp) {
        setMessage({ text: 'Account created successfully! Redirecting...', isError: false });
        setTimeout(() => setIsSignUp(false), 1500);
      } else if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        onLogin(); // Notify parent about successful login
        setMessage({ text: 'Signed in successfully!', isError: false });
        setTimeout(() => navigate('/'), 1000);
      }
    } catch (error) {
      setMessage({
        text: isSignUp
          ? 'Username already exists. Try a different one.'
          : 'Invalid username or password.',
        isError: true,
      });
    }
  };

  return (
    <AuthContainer>
      <h2 style={{ color: theme.text }}>{isSignUp ? 'Create Account' : 'Welcome Back'}</h2>
      <AuthForm onSubmit={handleSubmit}>
        {isSignUp && (
          <Input
            type="text"
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        )}
        <Input
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
          required
        />
        <Input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        {isSignUp && (
          <Input
            type="email"
            name="email"
            placeholder="Email (optional)"
            value={formData.email}
            onChange={handleChange}
          />
        )}
        <Button type="submit" isSignUp={isSignUp}>
          {isSignUp ? 'Sign Up' : 'Sign In'}
        </Button>
      </AuthForm>
      <SwitchText onClick={() => setIsSignUp(!isSignUp)}>
        {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
      </SwitchText>
      {message.text && <MessageContainer isError={message.isError}>{message.text}</MessageContainer>}
    </AuthContainer>
  );
}

export default AuthPage;
