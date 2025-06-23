import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useContext, useState } from 'react';
import { useNavigate } from 'react-router';
import styled from 'styled-components';

import InputField from '../UI/molecules/InputField';
import UsersContext from '../contexts/UsersContext';
import QuestionsContext from '../contexts/QuestionsContext';
import { UsersContextTypes, QuestionsContextTypes } from '../../types';

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
  input, textarea {
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

  textarea {
    min-height: 100px;
    resize: vertical;
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

const FooterText = styled.p`
  font-size: 12px;
  margin-top: 16px;
  color: #ccc;
  text-align: center;
`;

const AskQuestion = () => {
    const navigate = useNavigate();
    const { loggedInUser } = useContext(UsersContext) as UsersContextTypes;
    const { createQuestion } = useContext(QuestionsContext) as QuestionsContextTypes;
    const [message, setMessage] = useState('');

    const initialValues = {
        title: '',
        description: '',
        tags: ''
    };

    const validationSchema = Yup.object({
        title: Yup.string()
            .required('Title is required.')
            .min(5, 'Minimum 5 characters.')
            .max(120, 'Maximum 120 characters.')
            .trim(),

        description: Yup.string()
            .required('Description is required.')
            .min(30, 'Minimum 30 characters.')
            .max(5000, 'Maximum 5000 characters.')
            .trim(),

        tags: Yup.string()
            .required('At least one tag is required.')
            .matches(/^([a-zA-Z0-9]+,?\s*)+$/, 'Tags must be comma-separated words.')
            .trim()
    });

    const formik = useFormik({
        initialValues,
        validationSchema,
        onSubmit: async (values) => {
            if (!loggedInUser) {
                setMessage('You must be logged in to ask a question.');
                return;
            }

            const response = await createQuestion({
                title: values.title.trim(),
                description: values.description.trim(),
                tags: values.tags.split(',').map((t) => t.trim()).filter(Boolean),
                author: {
                    _id: loggedInUser._id,
                    username: loggedInUser.username,
                    profilePicture: loggedInUser.profilePicture,
                }
            });

            if ('error' in response) {
                setMessage(response.error);
            } else {
                setMessage('Question posted!');
                setTimeout(() => navigate('/'), 1800);
            }
        }
    });

    return (
        <PageWrapper>
            <Card>
                <Title>Ask a New Question</Title>

                <StyledForm onSubmit={formik.handleSubmit}>
                    <StyledFieldWrapper>
                        <InputField
                            labelText="Title"
                            inputType="text"
                            inputName="title"
                            inputId="title"
                            inputValue={formik.values.title}
                            inputOnChange={formik.handleChange}
                            inputOnBlur={formik.handleBlur}
                            errors={formik.errors.title}
                            touched={formik.touched.title}
                            inputPlaceholder="e.g., How to use useEffect in React?"
                        />
                    </StyledFieldWrapper>

                    <StyledFieldWrapper>
                        <label htmlFor="description">Description</label>
                        <textarea
                            id="description"
                            name="description"
                            value={formik.values.description}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            placeholder="Include all the details someone would need to answer your question..."
                        />
                        {formik.errors.description && formik.touched.description && (
                            <p className="error">{formik.errors.description}</p>
                        )}
                    </StyledFieldWrapper>

                    <StyledFieldWrapper>
                        <InputField
                            labelText="Tags (comma-separated)"
                            inputType="text"
                            inputName="tags"
                            inputId="tags"
                            inputValue={formik.values.tags}
                            inputOnChange={formik.handleChange}
                            inputOnBlur={formik.handleBlur}
                            errors={formik.errors.tags}
                            touched={formik.touched.tags}
                            inputPlaceholder="e.g., react, hooks, formik"
                        />
                    </StyledFieldWrapper>

                    <SubmitButton type="submit">Post Question</SubmitButton>
                </StyledForm>

                {message && <FooterText style={{ color: '#f5c518' }}>{message}</FooterText>}
            </Card>
        </PageWrapper>
    );
};

export default AskQuestion;