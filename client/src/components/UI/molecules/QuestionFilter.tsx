import { useFormik } from 'formik';
import { useContext } from 'react';
import styled from 'styled-components';
import QuestionsContext from '../../contexts/QuestionsContext';
import { QuestionsFilterValues } from '../../../types';

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
  const { applyFilter, resetFilters } = useContext(QuestionsContext)!;

  const formik = useFormik<QuestionsFilterValues>({
    initialValues: {
      isAnswered: undefined,
      title: '',
      tags: [],
    },
    onSubmit(values) {
      const filter: QuestionsFilterValues = {};

      if (values.isAnswered !== undefined) {
        filter.isAnswered = values.isAnswered;
      }
      if (values.title?.trim()) {
        filter.title = values.title.trim();
      }
      if (values.tags?.length) {
        filter.tags = values.tags;
      }

      applyFilter(filter);
    },
  });

  const handleReset = () => {
    formik.resetForm();
    resetFilters();
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

      <div style={{ display: 'flex', gap: '1rem' }}>
        <Button type="submit">Apply filter</Button>
        <Button type="button" onClick={handleReset}>Reset</Button>
      </div>
    </Form>
  );
};

export default QuestionFilter;