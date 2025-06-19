import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import styled from 'styled-components';

import InputField from '../UI/molecules/InputField';
import UsersContext from '../contexts/UsersContext';
import { User, UsersContextTypes } from '../../types';

const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #181818;
  min-height: 100vh;
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
    font-size: 12px;
    color: #f56262;
    margin-top: 4px;
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

const Register = () => {
  const navigate = useNavigate();
  const { registerUser } = useContext(UsersContext) as UsersContextTypes;
  const [stayLoggedIn, setStayLoggedIn] = useState(false);
  const [registerMessage, setRegisterMessage] = useState('');

  const initialValues: Omit<User, '_id' | 'createdAt'> & { passwordConfirm: string } = {
    email: '',
    username: '',
    password: '',
    passwordConfirm: '',
    profilePicture: ''
  };

  const validationSchema = Yup.object({
    email: Yup.string()
      .email('Please enter a valid email address.')
      .required('Email is required.')
      .trim(),

    username: Yup.string()
      .min(4, 'Username must be at least 4 characters.')
      .max(20, 'Username must be at most 20 characters.')
      .matches(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores.')
      .required('Username is required.')
      .trim(),

    password: Yup.string()
      .required('Password is required.')
      .min(8, 'Password must be at least 8 characters.')
      .max(25, 'Password must be at most 25 characters.')
      .matches(/[A-Z]/, 'Must include at least one uppercase letter.')
      .matches(/[a-z]/, 'Must include at least one lowercase letter.')
      .matches(/[0-9]/, 'Must include at least one number.')
      .matches(/[@$!%*?&]/, 'Must include at least one special character.')
      .trim(),

    passwordConfirm: Yup.string()
      .required('Please confirm your password.')
      .oneOf([Yup.ref('password')], 'Passwords must match.')
      .trim(),

    profilePicture: Yup.string()
      .url('Must be a valid image URL.')
      .matches(/^https?:\/\/.*\.(jpg|jpeg|png|gif|webp)$/i, 'Must be a valid image URL (jpg, png, etc).')
      .notRequired()
      .trim()
  });

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values) => {
      const { email, username, password, profilePicture } = values;
      const userData = { email, username, password, profilePicture };
      const response = await registerUser(userData, stayLoggedIn);
      if ('error' in response) {
        setRegisterMessage(response.error || 'Registration failed.');
        return;
      }
      setRegisterMessage(response.success);
      setTimeout(() => navigate('/'), 1800);
    }
  });

  return (
    <PageWrapper>
      <Card>
        <Title>Create Account</Title>

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
              labelText="Username"
              inputType="text"
              inputName="username"
              inputId="username"
              inputValue={formik.values.username}
              inputOnChange={formik.handleChange}
              inputOnBlur={formik.handleBlur}
              errors={formik.errors.username}
              touched={formik.touched.username}
              inputPlaceholder="Choose a username"
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
              inputPlaceholder="Create a password"
            />
          </StyledFieldWrapper>

          <StyledFieldWrapper>
            <InputField
              labelText="Confirm Password"
              inputType="password"
              inputName="passwordConfirm"
              inputId="passwordConfirm"
              inputValue={formik.values.passwordConfirm}
              inputOnChange={formik.handleChange}
              inputOnBlur={formik.handleBlur}
              errors={formik.errors.passwordConfirm}
              touched={formik.touched.passwordConfirm}
              inputPlaceholder="Repeat your password"
            />
          </StyledFieldWrapper>

          <StyledFieldWrapper>
            <InputField
              labelText="Profile Picture (optional)"
              inputType="url"
              inputName="profilePicture"
              inputId="profilePicture"
              inputValue={formik.values.profilePicture}
              inputOnChange={formik.handleChange}
              inputOnBlur={formik.handleBlur}
              errors={formik.errors.profilePicture}
              touched={formik.touched.profilePicture}
              inputPlaceholder="https://example.com/avatar.jpg"
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

          <SubmitButton type="submit">Register</SubmitButton>
        </StyledForm>

        {registerMessage && (
          <FooterText style={{ color: '#f5c518' }}>{registerMessage}</FooterText>
        )}

        <Divider />
        <FooterText>
          Already have an account? <FooterLink to="/login">Sign in</FooterLink>
        </FooterText>
      </Card>
    </PageWrapper>
  );
};

export default Register;