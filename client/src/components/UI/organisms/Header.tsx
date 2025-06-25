import { useContext } from 'react';
import { Link, useNavigate } from 'react-router';
import styled from 'styled-components';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

import UsersContext from '../../contexts/UsersContext.tsx';
import { UsersContextTypes } from '../../../types';

const HeaderWrapper = styled.header`
  background-color: #121212;
  padding: 0.75rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Logo = styled(Link)`
  font-size: 1.4rem;
  font-weight: 700;
  text-decoration: none;
  color: #f5c518;
`;

const Nav = styled.nav`
  display: flex;
  align-items: center;
  gap: 1.25rem;
`;

const NavLink = styled(Link)`
  color: white;
  text-decoration: none;
  font-size: 0.95rem;
  transition: color 0.2s ease;

  &:hover {
    color: #f5c518;
  }
`;

const UserName = styled.span`
  color: #f5c518;
  font-size: 0.9rem;
`;

const LogoutButton = styled.button`
  background: none;
  border: none;
  color: #ccc;
  font-size: 0.9rem;
  cursor: pointer;
  transition: color 0.2s ease;

  &:hover {
    color: #f5c518;
  }
`;

const Header = () => {
  const { loggedInUser, logoutUser } = useContext(UsersContext) as UsersContextTypes;
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser();
    navigate('/');
  };

  return (
    <HeaderWrapper>
      <Logo to="/">Movies Forum</Logo>
      <Nav>
        <NavLink to="/questions">Questions</NavLink>
        {loggedInUser && <NavLink to="/ask">Ask Question</NavLink>}

        {loggedInUser ? (
          <>
            <NavLink
              to="/user"
              style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <AccountCircleIcon style={{ color: '#f5c518', fontSize: '28px' }} />
              <UserName>{loggedInUser.username}</UserName>
            </NavLink>
            <LogoutButton onClick={handleLogout}>Logout</LogoutButton>
          </>
        ) : (
          <>
            <NavLink to="/login">Login</NavLink>
            <NavLink to="/register">Register</NavLink>
          </>
        )}
      </Nav>
    </HeaderWrapper>
  );
};

export default Header;