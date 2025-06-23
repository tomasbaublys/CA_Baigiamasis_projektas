import { createContext, useReducer, useState, useEffect, useRef } from 'react';
import {
  ChildrenProp,
  Question,
  QuestionsContextTypes,
  QuestionsReducerActionTypes,
  QuestionsFilterValues,
} from '../../types.ts';

const QuestionsContext = createContext<QuestionsContextTypes | undefined>(undefined);

const reducer = (state: Question[], action: QuestionsReducerActionTypes): Question[] => {
  switch (action.type) {
    case 'setQuestions':
      return action.questionData;
    case 'addQuestion':
      return [action.questionData, ...state];
    default:
      console.error('Unknown reducer action');
      return state;
  }
};

const QuestionsProvider = ({ children }: ChildrenProp) => {
  const [questions, dispatch] = useReducer(reducer, []);
  const [loading, setLoading] = useState(true);

  const filterQueryRef = useRef('');
  const sortQueryRef = useRef('');

  const fetchQuestions = () => {
    setLoading(true);

    const query = [filterQueryRef.current, sortQueryRef.current]
      .filter(Boolean)
      .join('&');

    const url = `http://localhost:5500/questions${query ? `?${query}` : ''}`;

    fetch(url)
      .then((res) => res.json())
      .then((data: Question[]) => {
        dispatch({ type: 'setQuestions', questionData: data });
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to fetch questions:', err);
        setLoading(false);
      });
  };

  const applySort = (sortValue: string) => {
    if (sortValue === 'dateAsc') {
      sortQueryRef.current = 'sort_createdAt=1';
    } else if (sortValue === 'dateDesc') {
      sortQueryRef.current = 'sort_createdAt=-1';
    } else if (sortValue === 'scoreAsc') {
      sortQueryRef.current = 'sort_score=1';
    } else if (sortValue === 'scoreDesc') {
      sortQueryRef.current = 'sort_score=-1';
    } else {
      sortQueryRef.current = '';
    }

    fetchQuestions();
  };

  const applyFilter = (values: QuestionsFilterValues) => {
    const filters: string[] = [];

    if (values.title) {
      filters.push(`filter_title=${encodeURIComponent(values.title)}`);
    }

    if (values.tag) {
      filters.push(`filter_tag=${encodeURIComponent(values.tag)}`);
    }

    filterQueryRef.current = filters.join('&');
    fetchQuestions();
  };

  const resetFilters = () => {
    filterQueryRef.current = '';
    fetchQuestions();
  };

const createQuestion: QuestionsContextTypes['createQuestion'] = async (questionData) => {
  const token =
    localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');

  if (!token) {
    return { error: 'Unauthorized. Please log in.' };
  }

  try {
    const res = await fetch('http://localhost:5500/questions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(questionData),
    });

    const data = await res.json();

    if (!res.ok || !data.questionData || !data.questionData._id) {
      return { error: data.error || 'Failed to create question.' };
    }

    dispatch({ type: 'addQuestion', questionData: data.questionData });
    return {
      success: 'Question created successfully.',
      newQuestionId: data.questionData._id,
    };
  } catch (error) {
    console.error('Error creating question:', error);
    return { error: 'Something went wrong. Please try again.' };
  }
};

  const getQuestionById = async (id: string): Promise<{ error: string } | { question: Question }> => {
    try {
      const res = await fetch(`http://localhost:5500/questions/${id}`);
      const data = await res.json();

      if (!res.ok || data.error) {
        return { error: data.error || 'Failed to fetch question.' };
      }

      return { question: data };
    } catch (err) {
      console.error('Error fetching question:', err);
      return { error: 'Failed to load question. Try again later.' };
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  return (
    <QuestionsContext.Provider
      value={{
        questions,
        applySort,
        applyFilter,
        resetFilters,
        loading,
        createQuestion,
        dispatch,
        getQuestionById,
      }}
    >
      {children}
    </QuestionsContext.Provider>
  );
};

export { QuestionsProvider };
export default QuestionsContext;