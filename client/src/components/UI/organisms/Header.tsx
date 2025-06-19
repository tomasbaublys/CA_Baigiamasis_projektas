import { Link } from 'react-router';
import styled from 'styled-components';

const HeaderWrapper = styled.header`
  background-color: #121212;
  color: #f5c518;
  padding: 10px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Logo = styled(Link)`
  color: #f5c518;
  font-size: 24px;
  text-decoration: none;
  font-weight: bold;

  &:hover {
    opacity: 0.8;
  }
`;

const Nav = styled.nav`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const NavLink = styled(Link)`
  color: #fff;
  text-decoration: none;
  font-size: 16px;

  &:hover {
    text-decoration: underline;
  }
`;

const Header = () => {
  return (
    <HeaderWrapper>
      <Logo to="/">FORUM</Logo>
      <Nav>
        <NavLink to="/questions">Questions</NavLink>
        <NavLink to="/login">Login</NavLink>
        <NavLink to="/register">Register</NavLink>
      </Nav>
    </HeaderWrapper>
  );
};

export default Header;