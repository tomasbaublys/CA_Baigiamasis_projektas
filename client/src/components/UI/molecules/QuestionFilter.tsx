import { useFormik } from 'formik';
import { useContext, useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import styled from 'styled-components';
import QuestionsContext from '../../contexts/QuestionsContext';
import { QuestionsFilterValues } from '../../../types';
import TagList from './TagList';
import { formatTags, parseTags } from '../../../utils/tagHelpers';

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  color: white;
`;

const FieldBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
`;

const Label = styled.label`
  font-size: 0.9rem;
`;

const Input = styled.input`
  padding: 0.3rem;
  border-radius: 4px;
  border: 1px solid #555;
  background-color: #1f1f1f;
  color: white;
`;

const Select = styled.select`
  padding: 0.3rem;
  border-radius: 4px;
  border: 1px solid #555;
  background-color: #1f1f1f;
  color: white;
`;

const Button = styled.button`
  background-color: #f5c518;
  padding: 0.4rem 0.8rem;
  font-weight: bold;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #e4b700;
  }
`;

const QuestionFilter = () => {
  const { resetFilters } = useContext(QuestionsContext)!;
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [tagsInput, setTagsInput] = useState('');

  const formik = useFormik<QuestionsFilterValues>({
    initialValues: {
      isAnswered: undefined,
      title: '',
      tags: [],
    },
    onSubmit(values) {
      const nextParams = new URLSearchParams();
      const tags = parseTags(tagsInput);

      if (values.isAnswered !== undefined) {
        nextParams.set('answered', String(values.isAnswered));
      }
      if (values.title?.trim()) {
        nextParams.set('title', values.title.trim());
      }
      tags.forEach((tag) => nextParams.append('tag', tag));

      navigate({
        pathname: '/questions',
        search: nextParams.toString(),
      });
    },
  });

  useEffect(() => {
    const tags = searchParams.getAll('tag');
    const title = searchParams.get('title') || '';
    const answered = searchParams.get('answered');

    formik.setValues({
      title,
      tags,
      isAnswered: answered === null ? undefined : answered === 'true',
    });
    setTagsInput(formatTags(tags));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const handleReset = () => {
    formik.resetForm();
    setTagsInput('');
    resetFilters();
    navigate('/questions');
  };

  return (
    <Form onSubmit={formik.handleSubmit}>
      <FieldBlock>
        <Label htmlFor="title">Search by title:</Label>
        <Input
          type="text"
          name="title"
          value={formik.values.title}
          onChange={formik.handleChange}
          placeholder="Enter title..."
        />
      </FieldBlock>

      <FieldBlock>
        <Label htmlFor="isAnswered">Filter by answers:</Label>
        <Select
          name="isAnswered"
          value={
            formik.values.isAnswered === undefined
              ? ''
              : formik.values.isAnswered
                ? 'true'
                : 'false'
          }
          onChange={(e) => {
            const val = e.target.value;
            formik.setFieldValue(
              'isAnswered',
              val === '' ? undefined : val === 'true'
            );
          }}
        >
          <option value="">All questions</option>
          <option value="true">Only answered</option>
          <option value="false">Only unanswered</option>
        </Select>
      </FieldBlock>

      <FieldBlock>
        <Label htmlFor="tags">Filter by tags:</Label>
        <Input
          type="text"
          name="tags"
          value={tagsInput}
          onChange={(e) => {
            setTagsInput(e.target.value);
            formik.setFieldValue('tags', parseTags(e.target.value));
          }}
          placeholder="react, hooks"
        />
        <TagList tags={formik.values.tags} linkTags={false} />
      </FieldBlock>

      <div style={{ display: 'flex', gap: '1rem' }}>
        <Button type="submit">Apply filter</Button>
        <Button type="button" onClick={handleReset}>Reset</Button>
      </div>
    </Form>
  );
};

export default QuestionFilter;
