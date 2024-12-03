// frontend/src/components/Navbar.js

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled, { useTheme } from 'styled-components';
import { FiSun, FiMoon, FiLogOut } from 'react-icons/fi';

const NavbarContainer = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background-color: ${({ theme }) => theme.navBackground};
  color: ${({ theme }) => theme.text};
`;

const NavLinks = styled.div`
  display: flex;
  gap: 1.5rem;
`;

const NavLink = styled(Link)`
  color: ${({ theme }) => theme.text};
  text-decoration: none;
  font-size: 1.2rem;

  &:hover {
    color: ${({ theme }) => theme.hover};
  }
`;

const ThemeToggle = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.text};
  cursor: pointer;
  font-size: 1.5rem;
`;

function Navbar({ isAuthenticated, toggleTheme }) {
  const theme = useTheme();  // Retrieve the theme context
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/auth');
  };

  return (
    <NavbarContainer>
      <NavLinks>
        <NavLink to="/">Buckets</NavLink>
        <NavLink to="/calendar">Calendar</NavLink>
      </NavLinks>
      <div>
        <ThemeToggle onClick={toggleTheme}>
          {theme.mode === 'light' ? <FiMoon /> : <FiSun />}
        </ThemeToggle>
        {isAuthenticated && (
          <ThemeToggle onClick={handleLogout}>
            <FiLogOut />
          </ThemeToggle>
        )}
      </div>
    </NavbarContainer>
  );
}

export default Navbar;
