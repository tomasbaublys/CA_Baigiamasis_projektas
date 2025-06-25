import { useContext, useEffect } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router';
import QuestionsContext from '../contexts/QuestionsContext';

const Wrapper = styled.div`
  max-width: 800px;
  margin: 4rem auto;
  padding: 2rem;
  color: white;
  text-align: center;
`;

const Title = styled.h1`
  font-size: 2rem;
  color: #f5c518;
  margin-bottom: 1.5rem;
`;

const Subtitle = styled.p`
  font-size: 1.1rem;
  color: #ccc;
  line-height: 1.6;

  strong {
    color: #f5c518;
  }
`;

const StyledLink = styled(Link)`
  color: #f5c518;
  text-decoration: none;
  font-weight: 500;
  display: inline-block;
  margin-top: 1.5rem;

  &:hover {
    color: #ffffff;
  }
`;

const Home = () => {
  const { filteredDataAmount: totalQuestions, resetFilters, fetchQuestions } = useContext(QuestionsContext)!;

  useEffect(() => {
    resetFilters();
    fetchQuestions();
  }, [resetFilters, fetchQuestions]);

  return (
    <Wrapper>
      <Title>🎬 Welcome to the Movies Forum</Title>
      <Subtitle>
        Dive into movie discussions with fellow enthusiasts.
        <br />
        We already have <strong>{totalQuestions}</strong> questions posted!
      </Subtitle>
      <StyledLink to="/questions">Browse all questions →</StyledLink>
    </Wrapper>
  );
};

export default Home;