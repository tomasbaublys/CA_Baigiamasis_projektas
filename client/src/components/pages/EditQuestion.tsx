import styled from 'styled-components';
import { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router';
import { useFormik } from 'formik';
import * as Yup from 'yup';

import QuestionsContext from '../contexts/QuestionsContext.tsx';
import UsersContext from '../contexts/UsersContext.tsx';

import { QuestionsContextTypes, UsersContextTypes } from '../../types.ts';
import InputField from '../../components/UI/molecules/InputField.tsx';

const FormContainer = styled.form`
  max-width: 320px;
  margin: 40px auto;
  padding: 20px;
  background-color: #1c1c1c;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(255, 255, 255, 0.1);
`;

const FormTitle = styled.h2`
  text-align: center;
  color: #f5c518;
  margin-bottom: 20px;
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 10px;
  background-color: #f5c518;
  color: #000;
  font-weight: bold;
  border: none;
  border-radius: 6px;
  margin-top: 10px;
  cursor: pointer;

  &:hover {
    background-color: #ffe871;
  }
`;

const EditQuestion = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { getQuestionById, editQuestion } = useContext(QuestionsContext) as QuestionsContextTypes;
  const { loggedInUser } = useContext(UsersContext) as UsersContextTypes;

  const [initialValues, setInitialValues] = useState({
    title: '',
    description: '',
    tags: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;

      const res = await getQuestionById(id);
      if ('question' in res) {
        const questionData = res.question;
        setInitialValues({
          title: questionData.title,
          description: questionData.description,
          tags: questionData.tags.join(', '),
        });
      }
    };

    fetchData();
  }, [id, getQuestionById]);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues,
    validationSchema: Yup.object({
      title: Yup.string().required('Required'),
      description: Yup.string().required('Required'),
      tags: Yup.string().required('Required'),
    }),
    onSubmit: async (values) => {
      if (!id || !loggedInUser) return;

      const updated = {
        title: values.title,
        description: values.description,
        tags: values.tags.split(',').map((tag) => tag.trim()),
      };

      const res = await editQuestion(id, updated);

      if ('success' in res) {
        navigate(`/questions/${id}`);
      }
    },
  });

  return (
    <FormContainer onSubmit={formik.handleSubmit}>
      <FormTitle>Edit Your Question</FormTitle>

      <InputField
        labelText="Title"
        inputType="text"
        inputName="title"
        inputId="title"
        inputValue={formik.values.title}
        errors={formik.errors.title}
        touched={formik.touched.title}
        inputOnChange={formik.handleChange}
        inputOnBlur={formik.handleBlur}
      />

      <InputField
        labelText="Description"
        inputType="textarea"
        inputName="description"
        inputId="description"
        inputValue={formik.values.description}
        errors={formik.errors.description}
        touched={formik.touched.description}
        inputOnChange={formik.handleChange}
        inputOnBlur={formik.handleBlur}
      />

      <InputField
        labelText="Tags (comma separated)"
        inputType="text"
        inputName="tags"
        inputId="tags"
        inputValue={formik.values.tags}
        errors={formik.errors.tags}
        touched={formik.touched.tags}
        inputOnChange={formik.handleChange}
        inputOnBlur={formik.handleBlur}
      />

      <SubmitButton type="submit">Update Question</SubmitButton>
    </FormContainer>
  );
};

export default EditQuestion;