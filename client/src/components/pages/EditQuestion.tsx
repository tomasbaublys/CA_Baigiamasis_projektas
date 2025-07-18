import styled from 'styled-components';
import { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router';
import { useFormik } from 'formik';
import * as Yup from 'yup';

import QuestionsContext from '../contexts/QuestionsContext.tsx';
import UsersContext from '../contexts/UsersContext.tsx';

import { QuestionsContextTypes, UsersContextTypes } from '../../types.ts';
import InputField from '../../components/UI/molecules/InputField.tsx';

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
    <PageWrapper>
      <Card>
        <Title>Edit Your Question</Title>

        <StyledForm onSubmit={formik.handleSubmit}>
          <StyledFieldWrapper>
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
          </StyledFieldWrapper>

          <StyledFieldWrapper>
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formik.values.description}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.errors.description && formik.touched.description && (
              <p className="error">{formik.errors.description}</p>
            )}
          </StyledFieldWrapper>

          <StyledFieldWrapper>
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
          </StyledFieldWrapper>

          <SubmitButton type="submit">Update Question</SubmitButton>
        </StyledForm>
      </Card>
    </PageWrapper>
  );
};

export default EditQuestion;