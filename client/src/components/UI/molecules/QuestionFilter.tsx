import { useFormik } from 'formik';
import { useContext, useMemo, useRef } from 'react';
import styled from 'styled-components';
import QuestionsContext from '../../contexts/QuestionsContext.tsx';

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
  const { questions, applyFilter, resetFilters } = useContext(QuestionsContext)!;

  const { minYear, maxYear } = useMemo(() => {
    const years = questions
      .map((q) => new Date(q.createdAt).getFullYear())
      .filter((year) => !isNaN(year));
    return {
      minYear: Math.min(...years),
      maxYear: Math.max(...years),
    };
  }, [questions]);

  const defaultRange = useRef({ min: minYear, max: maxYear });

  const formik = useFormik({
    initialValues: {
      createdAt_gte: minYear,
      createdAt_lte: maxYear,
    },
    onSubmit(values) {
      applyFilter({
        createdAt_gte: `${values.createdAt_gte}-01-01`,
        createdAt_lte: `${values.createdAt_lte}-12-31`,
      });
    },
  });

  const handleReset = () => {
    formik.setValues({
      createdAt_gte: defaultRange.current.min,
      createdAt_lte: defaultRange.current.max,
    });
    resetFilters();
  };

  return (
    <Form onSubmit={formik.handleSubmit}>
      <FieldBlock>
        <Label htmlFor="createdAt_gte">From year:</Label>
        <Input
          type="number"
          name="createdAt_gte"
          min={minYear}
          max={maxYear}
          value={formik.values.createdAt_gte}
          onChange={formik.handleChange}
        />
      </FieldBlock>

      <FieldBlock>
        <Label htmlFor="createdAt_lte">To year:</Label>
        <Input
          type="number"
          name="createdAt_lte"
          min={minYear}
          max={maxYear}
          value={formik.values.createdAt_lte}
          onChange={formik.handleChange}
        />
      </FieldBlock>

      <div style={{ display: 'flex', gap: '1rem' }}>
        <Button type="submit">Apply filter</Button>
        <Button type="button" onClick={handleReset}>Reset</Button>
      </div>
    </Form>
  );
};

export default QuestionFilter;