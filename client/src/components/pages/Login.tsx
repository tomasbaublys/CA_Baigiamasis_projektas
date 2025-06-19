import { Link } from 'react-router';
import styled from 'styled-components';

const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 20px;
  max-width: 320px;
  margin: 0 auto;
  color: #fff;
`;

const Logo = styled(Link)`
  font-size: 28px;
  font-weight: bold;
  color: #f5c518;
  text-decoration: none;
  margin-bottom: 24px;

  &:hover {
    opacity: 0.8;
  }
`;

const Title = styled.h1`
  font-size: 24px;
  margin-bottom: 24px;
`;

const StyledForm = styled.form`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

const Input = styled.input`
  padding: 10px;
  background-color: #222;
  border: 1px solid #555;
  border-radius: 4px;
  color: #fff;
  font-size: 14px;

  &:focus {
    border-color: #f5c518;
    outline: none;
  }
`;

const CheckboxWrapper = styled.label`
  display: flex;
  align-items: center;
  font-size: 13px;
  color: #ccc;
  gap: 8px;
`;

const SubmitButton = styled.button`
  background-color: #f5c518;
  color: #000;
  font-weight: bold;
  padding: 10px;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #e4b800;
  }
`;

const Divider = styled.hr`
  width: 98%;
  border: none;
  border-top: 1px solid #555;
  margin: 20px 0;
`;

const Footer = styled.footer`
  font-size: 12px;
  color: #999;
  text-align: center;
`;

const FooterLink = styled(Link)`
  color: #999;
  text-decoration: none;
  margin: 0 8px;

  &:hover {
    text-decoration: underline;
  }
`;

const Login = () => {
  return (
    <PageWrapper>
      <Logo to="/">FORUM</Logo>
      <Title>Sign In</Title>
      <StyledForm>
        <Input type="email" placeholder="Email" />
        <Input type="password" placeholder="Password" />
        <CheckboxWrapper>
          <input type="checkbox" />
          Keep me signed in
        </CheckboxWrapper>
        <SubmitButton type="submit">Sign In</SubmitButton>
      </StyledForm>
      <Divider />
      <div style={{ fontSize: '13px', color: '#ccc' }}>
        New to the Forum? <Link to="/register" style={{ color: '#f5c518' }}>Create an account</Link>
      </div>
      <Divider />
      <Footer>
        <FooterLink to="#">Help</FooterLink>
        <FooterLink to="#">Conditions of Use</FooterLink>
        <FooterLink to="#">Privacy Notice</FooterLink>
      </Footer>
    </PageWrapper>
  );
};

export default Login;