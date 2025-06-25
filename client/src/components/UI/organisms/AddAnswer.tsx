import { useContext } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import styled from 'styled-components';
import { useParams } from 'react-router';

import InputField from '../molecules/InputField';
import AnswersContext from '../../contexts/AnswersContext';
import UsersContext from '../../contexts/UsersContext';
import { AnswersContextTypes, UsersContextTypes } from '../../../types';

const FormWrapper = styled.div`
  margin-top: 3rem;
  padding: 2rem;
  background-color: #1a1a1a;
  border: 1px solid #333;
  border-radius: 8px;

  textarea {
    background-color: #2a2a2a;
    color: white;
    border: 1px solid #444;
    padding: 0.6rem 0.8rem;
    border-radius: 4px;
    font-size: 1rem;
    resize: vertical;

    &::placeholder {
      color: #999;
    }

    &:focus {
      outline: none;
      border-color: #f5c518;
    }
  }
`;

const Heading = styled.h3`
  color: #f5c518;
  margin-bottom: 1rem;
`;

const SubmitButton = styled.button`
  background-color: #f5c518;
  border: none;
  padding: 0.6rem 1.2rem;
  font-weight: bold;
  margin-top: 1rem;
  cursor: pointer;
  border-radius: 4px;
`;

const AddAnswer = () => {
  const { postAnswer } = useContext(AnswersContext) as AnswersContextTypes;
  const { loggedInUser } = useContext(UsersContext) as UsersContextTypes;
  const { id: questionId } = useParams();

  const formik = useFormik({
    initialValues: {
      content: ''
    },
    validationSchema: Yup.object({
      content: Yup.string()
        .required('Answer is required')
        .min(10, 'Answer must be at least 10 characters')
        .max(1000, 'Answer cannot exceed 1000 characters')
    }),
    onSubmit: async (values, { resetForm }) => {
      if (!questionId) return;
      await postAnswer(questionId, values.content);
      resetForm();
    }
  });

  if (!loggedInUser) return null;

  return (
    <FormWrapper>
      <Heading>Post Your Answer</Heading>
      <form onSubmit={formik.handleSubmit}>
        <InputField
          labelText="" // Label removed
          inputType="text"
          inputName="content"
          inputId="content"
          inputValue={formik.values.content}
          inputOnChange={formik.handleChange}
          inputOnBlur={formik.handleBlur}
          errors={formik.errors.content}
          touched={formik.touched.content}
          inputPlaceholder="Write your answer..."
          as="textarea"
          rows={5}
        />
        <SubmitButton type="submit">Submit</SubmitButton>
      </form>
    </FormWrapper>
  );
};

export default AddAnswer;