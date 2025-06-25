import { createContext, useReducer } from 'react';
import { ChildrenProp, Answer, AnswersContextTypes, AnswersReducerActionTypes } from '../../types.ts';

const AnswersContext = createContext<AnswersContextTypes>({} as AnswersContextTypes);

const answersReducer = (state: Answer[], action: AnswersReducerActionTypes): Answer[] => {
  switch (action.type) {
    case 'setAnswers':
      return action.answers;
    case 'addAnswer':
      return [...state, action.answer];
    case 'updateAnswer':
      return state.map(a => (a._id === action.answer._id ? action.answer : a));
    case 'deleteAnswer':
      return state.filter(a => a._id !== action.id);
    default:
      return state;
  }
};

const AnswersProvider = ({ children }: ChildrenProp) => {
  const [answers, dispatch] = useReducer(answersReducer, []);

  const getAnswersByQuestionId = async (questionId: string) => {
    try {
      const res = await fetch(`http://localhost:5500/questions/${questionId}/answers`);
      const data = await res.json();
      dispatch({ type: 'setAnswers', answers: data });
    } catch (err) {
      console.error('getAnswersByQuestionId error:', err);
    }
  };

  const postAnswer = async (questionId: string, content: string) => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    try {
      const res = await fetch(`http://localhost:5500/questions/${questionId}/answers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ content })
      });
      const data = await res.json();
      if (res.ok) {
        dispatch({ type: 'addAnswer', answer: data.answerData });
      }
    } catch (err) {
      console.error('postAnswer error:', err);
    }
  };

  const editAnswer = async (answerId: string, content: string) => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    try {
      const res = await fetch(`http://localhost:5500/answers/${answerId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ content })
      });
      const data = await res.json();
      if (res.ok) {
        dispatch({ type: 'updateAnswer', answer: data.answerData });
      }
    } catch (err) {
      console.error('editAnswer error:', err);
    }
  };

  const deleteAnswer = async (answerId: string) => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    try {
      const res = await fetch(`http://localhost:5500/answers/${answerId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (res.ok) {
        dispatch({ type: 'deleteAnswer', id: answerId });
      }
    } catch (err) {
      console.error('deleteAnswer error:', err);
    }
  };

  return (
    <AnswersContext.Provider
      value={{ 
        answers, 
        getAnswersByQuestionId, 
        postAnswer, 
        editAnswer, 
        deleteAnswer, 
        dispatch 
    }}
    >
      {children}
    </AnswersContext.Provider>
  );
};

export { AnswersProvider };
export default AnswersContext;