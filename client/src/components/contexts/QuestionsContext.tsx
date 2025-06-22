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
      return action.data;
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
        dispatch({ type: 'setQuestions', data: data });
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
      }}
    >
      {children}
    </QuestionsContext.Provider>
  );
};

export { QuestionsProvider };
export default QuestionsContext;