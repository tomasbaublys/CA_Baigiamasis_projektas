import { useContext, useEffect, useState } from 'react';
import { useParams, Link } from 'react-router';
import styled from 'styled-components';

import QuestionsContext from '../contexts/QuestionsContext';
import UsersContext from '../contexts/UsersContext';

import { Question, QuestionsContextTypes, UsersContextTypes } from '../../types';

const Wrapper = styled.div`
  padding: 2rem 1rem;
  color: white;
  max-width: 800px;
  margin: 0 auto;
`;

const Title = styled.h1`
  font-size: 24px;
  margin-bottom: 1rem;
`;

const Meta = styled.div`
  font-size: 14px;
  color: #aaa;
  margin-bottom: 1rem;
`;

const Body = styled.div`
  font-size: 16px;
  line-height: 1.5;
  white-space: pre-wrap;
`;

const Error = styled.p`
  color: #f56262;
  font-weight: bold;
`;

const EditButton = styled(Link)`
  display: inline-block;
  margin-top: 1.5rem;
  padding: 8px 16px;
  background-color: #f5c518;
  color: #181818;
  font-weight: bold;
  border-radius: 5px;
  text-decoration: none;
  &:hover {
    background-color: #e2b33c;
  }
`;

const SpecificQuestion = () => {
  const { id } = useParams();
  const { getQuestionById } = useContext(QuestionsContext) as QuestionsContextTypes;
  const { loggedInUser } = useContext(UsersContext) as UsersContextTypes;

  const [question, setQuestion] = useState<Question | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) {
      setError('No question ID provided.');
      return;
    }

    const fetchQuestion = async () => {
      const res = await getQuestionById(id);
      if ('error' in res) {
        setError(res.error);
      } else {
        setQuestion(res.question);
      }
    };

    fetchQuestion();
  }, [id, getQuestionById]);

  if (error) {
    return (
      <Wrapper>
        <Error>{error}</Error>
      </Wrapper>
    );
  }

  if (!question) {
    return (
      <Wrapper>
        <p>Loading...</p>
      </Wrapper>
    );
  }

  const isAuthor = loggedInUser && question.author._id === loggedInUser._id;

  return (
    <Wrapper>
      <Title>{question.title}</Title>
      <Meta>
        Asked by <strong>{question.author.username}</strong> •{' '}
        {new Date(question.createdAt).toLocaleString()}
      </Meta>
      <Body>{question.description}</Body>

      {isAuthor && (
        <EditButton to={`/questions/${question._id}/edit`}>
          Edit Question
        </EditButton>
      )}
    </Wrapper>
  );
};

export default SpecificQuestion;