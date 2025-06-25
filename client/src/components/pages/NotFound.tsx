import styled from 'styled-components';
import { Link } from 'react-router';

const Wrapper = styled.div`
  text-align: center;
  padding: 4rem;
  color: white;
`;

const NotFound = () => (
  <Wrapper>
    <h1>404 - Page Not Found</h1>
    <p>The page you are looking for doesn’t exist.</p>
    <Link to="/" style={{ color: '#f5c518', textDecoration: 'underline' }}>
      Go Home
    </Link>
  </Wrapper>
);

export default NotFound;