import { useContext } from 'react';
import styled from 'styled-components';
import QuestionsContext from '../../contexts/QuestionsContext.tsx';

const Container = styled.div`
  margin-top: 1rem;
  color: white;
`;

const Label = styled.label`
  margin-bottom: 0.5rem;
  display: block;
`;

const Select = styled.select`
  padding: 0.3rem;
  background-color: #1f1f1f;
  color: white;
  border: 1px solid #444;
  border-radius: 4px;
`;

const Option = styled.option``;

const QuestionSort = () => {
  const { applySort } = useContext(QuestionsContext)!;

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    applySort(e.target.value);
  };

  return (
    <Container>
      <Label htmlFor="sort">Sort questions by:</Label>
      <Select id="sort" onChange={handleChange}>
        <Option value="">Default</Option>
        <Option value="dateDesc">Newest first ↑</Option>
        <Option value="dateAsc">Oldest first ↓</Option>
        <Option value="answersDesc">Most answers ↑</Option>
        <Option value="answersAsc">Least answers ↓</Option>
      </Select>
    </Container>
  );
};

export default QuestionSort;