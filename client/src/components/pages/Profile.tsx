import { useContext, useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import styled from 'styled-components';
import { Link, useNavigate } from 'react-router';

import UsersContext from '../contexts/UsersContext';
import InputField from '../UI/molecules/InputField';
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

const Profile = () => {
  const navigate = useNavigate();
  const { decodeFromToken, getUserId, editUser, dispatch } = useContext(UsersContext) as UsersContextTypes;
  const user = decodeFromToken();
  const [userId, setUserId] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchId = async () => {
      const res = await getUserId();
      if ('id' in res) {
        setUserId(res.id);
      } else if ('error' in res) {
        setMessage(res.error || 'Could not fetch user ID');
      } else {
        setMessage('Unexpected error occurred while fetching user ID.');
      }
    };
    fetchId();
  }, [getUserId]);

  const initialValues = {
    username: user?.username || '',
    oldPassword: '',
    password: '',
    passwordConfirm: '',
    profilePicture: user?.profilePicture || ''
  };

  const validationSchema = Yup.object({
    username: Yup.string().min(4).max(20).required('Username is required'),
    oldPassword: Yup.string()
      .matches(/[A-Z]/, 'Must include uppercase')
      .matches(/[a-z]/, 'Must include lowercase')
      .matches(/[0-9]/, 'Must include number')
      .matches(/[@$!%*?&]/, 'Must include special character')
      .min(8)
      .max(25),
    password: Yup.string()
      .min(8)
      .max(25)
      .matches(/[A-Z]/, 'Must include uppercase')
      .matches(/[a-z]/, 'Must include lowercase')
      .matches(/[0-9]/, 'Must include number')
      .matches(/[@$!%*?&]/, 'Must include special character')
      .when('oldPassword', {
        is: (val: string) => !!val,
        then: schema =>
          schema
            .required('New password required if old is given')
            .notOneOf([Yup.ref('oldPassword')], 'New password must differ'),
        otherwise: schema => schema.notRequired(),
      }),
    passwordConfirm: Yup.string()
      .oneOf([Yup.ref('password')], 'Passwords must match')
      .when('password', {
        is: (val: string) => !!val,
        then: schema => schema.required('Confirm password required')
      }),
    profilePicture: Yup.string()
      .url('Must be a valid image URL')
      .matches(/^https?:\/\/.*\.(jpg|jpeg|png|webp)$/i, 'Must be a valid image')
      .notRequired()
  });

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async values => {
      void values.passwordConfirm;

      const { username, profilePicture, oldPassword, password } = values;

      const dataToSend: {
        username: string;
        profilePicture: string;
        oldPassword?: string;
        password?: string;
      } = {
        username,
        profilePicture
      };

      if (oldPassword.trim()) dataToSend.oldPassword = oldPassword;
      if (password.trim()) dataToSend.password = password;

      if (!userId) {
        setMessage('User ID is still loading. Please wait and try again.');
        return;
      }

      const result = await editUser(dataToSend, userId);
      if ('error' in result) {
        setMessage(result.error);
        return;
      }

      const refreshed = decodeFromToken();
      if (refreshed) {
        dispatch({ type: 'setUser', userData: refreshed });
      }

      setMessage(result.success);
      setTimeout(() => navigate('/'), 1500);
    }
  });

  return (
    <PageWrapper>
      <Card>
        <Title>Update Profile</Title>
        <StyledForm onSubmit={formik.handleSubmit}>
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
              inputPlaceholder="Update username"
            />
          </StyledFieldWrapper>

          <StyledFieldWrapper>
            <InputField
              labelText="Old Password"
              inputType="password"
              inputName="oldPassword"
              inputId="oldPassword"
              inputValue={formik.values.oldPassword || ''}
              inputOnChange={formik.handleChange}
              inputOnBlur={formik.handleBlur}
              errors={formik.errors.oldPassword}
              touched={formik.touched.oldPassword}
              inputPlaceholder="Enter current password"
            />
          </StyledFieldWrapper>

          <StyledFieldWrapper>
            <InputField
              labelText="New Password"
              inputType="password"
              inputName="password"
              inputId="password"
              inputValue={formik.values.password || ''}
              inputOnChange={formik.handleChange}
              inputOnBlur={formik.handleBlur}
              errors={formik.errors.password}
              touched={formik.touched.password}
              inputPlaceholder="Enter new password"
            />
          </StyledFieldWrapper>

          <StyledFieldWrapper>
            <InputField
              labelText="Confirm Password"
              inputType="password"
              inputName="passwordConfirm"
              inputId="passwordConfirm"
              inputValue={formik.values.passwordConfirm || ''}
              inputOnChange={formik.handleChange}
              inputOnBlur={formik.handleBlur}
              errors={formik.errors.passwordConfirm}
              touched={formik.touched.passwordConfirm}
              inputPlaceholder="Repeat new password"
            />
          </StyledFieldWrapper>

          <StyledFieldWrapper>
            <InputField
              labelText="Profile Picture"
              inputType="url"
              inputName="profilePicture"
              inputId="profilePicture"
              inputValue={''}
              inputOnChange={formik.handleChange}
              inputOnBlur={formik.handleBlur}
              errors={formik.errors.profilePicture}
              touched={formik.touched.profilePicture}
              inputPlaceholder="https://example.com/avatar.jp"
            />
          </StyledFieldWrapper>

          <SubmitButton type="submit">Save Changes</SubmitButton>
        </StyledForm>

        {message && (
          <FooterText style={{ color: '#f5c518' }}>{message}</FooterText>
        )}

        <Divider />
        <FooterText>
          <FooterLink to="/">Back to Home</FooterLink>
        </FooterText>
      </Card>
    </PageWrapper>
  );
};

export default Profile;