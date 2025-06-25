import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import styled from 'styled-components';

import InputField from '../UI/molecules/InputField';
import UsersContext from '../contexts/UsersContext';
import { UsersContextTypes } from '../../types';

const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 3rem 1rem;
  color: #fff;
`;

const Card = styled.div`
  width: 320px;
  background-color: #1f1f1f;
  border: 1px solid #333;
  border-radius: 8px;
  padding: 20px 25px;
  color: #fff;
`;

const Title = styled.h1`
  font-size: 20px;
  font-weight: 400;
  margin-bottom: 24px;
  text-align: center;
`;

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const StyledFieldWrapper = styled.div`
  input {
    background-color: #2a2a2a;
    color: white;
    border: 1px solid #555;
    border-radius: 3px;
    padding: 6px;
    font-size: 12px;
    width: 100%;

    &:focus {
      outline: none;
      border-color: #f5c518;
    }
  }

  label {
    font-size: 12px;
    font-weight: bold;
    color: #ccc;
    display: block;
    margin-bottom: 4px;
  }

  .error {
    font-size: 10px;
    color: #f56262;
    margin-top: 2px;
  }
`;

const SubmitButton = styled.button`
  background-color: #f5c518;
  border: none;
  border-radius: 20px;
  width: 100%;
  padding: 8px 0;
  font-size: 13px;
  margin-top: 8px;
  cursor: pointer;
  font-weight: bold;
  color: #181818;

  &:hover {
    background-color: #e2b33c;
  }
`;

const Divider = styled.hr`
  width: 100%;
  border: none;
  border-top: 1px solid #444;
  margin: 20px 0;
`;

const FooterText = styled.p`
  font-size: 12px;
  margin-top: 16px;
  color: #ccc;
  text-align: center;
`;

const FooterLink = styled(Link)`
  color: #f5c518;
  text-decoration: none;
  font-weight: 500;

  &:hover {
    text-decoration: underline;
  }
`;

const Login = () => {
  const navigate = useNavigate();
  const { loginUser } = useContext(UsersContext) as UsersContextTypes;
  const [stayLoggedIn, setStayLoggedIn] = useState(false);
  const [loginMessage, setLoginMessage] = useState('');

  const validationSchema = Yup.object({
    email: Yup.string()
      .email('Please enter a valid email address.')
      .required('Email is required.')
      .trim(),
    password: Yup.string()
      .required('Password is required.')
      .trim()
  });

  const formik = useFormik({
    initialValues: {
      email: '',
      password: ''
    },
    validationSchema,
    onSubmit: async (values) => {
      const response = await loginUser(values, stayLoggedIn);
      if ('error' in response) {
        setLoginMessage(response.error || 'Login failed.');
        return;
      }
      setLoginMessage(response.success);
      setTimeout(() => navigate('/'), 1800);
    }
  });

  return (
    <PageWrapper>
      <Card>
        <Title>Sign In</Title>

        <StyledForm onSubmit={formik.handleSubmit}>
          <StyledFieldWrapper>
            <InputField
              labelText="Email"
              inputType="email"
              inputName="email"
              inputId="email"
              inputValue={formik.values.email}
              inputOnChange={formik.handleChange}
              inputOnBlur={formik.handleBlur}
              errors={formik.errors.email}
              touched={formik.touched.email}
              inputPlaceholder="you@example.com"
            />
          </StyledFieldWrapper>

          <StyledFieldWrapper>
            <InputField
              labelText="Password"
              inputType="password"
              inputName="password"
              inputId="password"
              inputValue={formik.values.password}
              inputOnChange={formik.handleChange}
              inputOnBlur={formik.handleBlur}
              errors={formik.errors.password}
              touched={formik.touched.password}
              inputPlaceholder="Enter your password"
            />
          </StyledFieldWrapper>

          <label style={{ fontSize: '12px', marginTop: '6px' }}>
            <input
              type="checkbox"
              checked={stayLoggedIn}
              onChange={() => setStayLoggedIn(!stayLoggedIn)}
              style={{ marginRight: '6px' }}
            />
            Stay logged in
          </label>

          <SubmitButton type="submit">Login</SubmitButton>
        </StyledForm>

        {loginMessage && (
          <FooterText style={{ color: '#f5c518' }}>{loginMessage}</FooterText>
        )}

        <Divider />
        <FooterText>
          New to Forum? <FooterLink to="/register">Create account</FooterLink>
        </FooterText>
      </Card>
    </PageWrapper>
  );
};

export default Login;