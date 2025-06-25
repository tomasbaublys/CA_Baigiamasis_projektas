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
  const [filteredDataAmount, setFilteredDataAmount] = useState(0);

  const filterQueryRef = useRef('');
  const sortQueryRef = useRef('');
  const currentPageRef = useRef(1);
  const pageSizeRef = useRef(4);

  const fetchQuestions = async (): Promise<void> => {
    setLoading(true);
    const skip = (currentPageRef.current - 1) * pageSizeRef.current;
    const query = [
      `skip=${skip}`,
      `limit=${pageSizeRef.current}`,
      filterQueryRef.current,
      sortQueryRef.current
    ].filter(Boolean).join('&');

    const url = `http://localhost:5500/questions?${query}`;

    try {
      const res = await fetch(url);
      const data: Question[] = await res.json();
      dispatch({ type: 'setQuestions', questionData: data });
    } catch (err) {
      console.error('Failed to fetch questions:', err);
    } finally {
      setLoading(false);
    }
  };

  const getFilteredDataAmount = async () => {
    try {
      const res = await fetch(`http://localhost:5500/questions/getCount?${filterQueryRef.current}`);
      const data = await res.json();
      setFilteredDataAmount(data.totalAmount);
    } catch (err) {
      console.error('Failed to get question count:', err);
    }
  };

  const changeSort = (sortValue: string) => {
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
    currentPageRef.current = 1;
    getFilteredDataAmount();
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
    currentPageRef.current = 1;
    getFilteredDataAmount();
    fetchQuestions();
  };

  const changePageSize = (size: number) => {
    pageSizeRef.current = size;
    currentPageRef.current = 1;
    fetchQuestions();
  };

  const changePage = (page: number) => {
    currentPageRef.current = page;
    fetchQuestions();
  };

  const resetFilters = () => {
    filterQueryRef.current = '';
    currentPageRef.current = 1;
    fetchQuestions();
  };

  const createQuestion: QuestionsContextTypes['createQuestion'] = async (questionData) => {
    const token = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
    if (!token) return { error: 'Unauthorized. Please log in.' };

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
      return { success: 'Question created successfully.', newQuestionId: data.questionData._id };
    } catch (error) {
      console.error('Error creating question:', error);
      return { error: 'Something went wrong. Please try again.' };
    }
  };

  const editQuestion: QuestionsContextTypes['editQuestion'] = async (id, updatedFields) => {
    const token = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
    if (!token) return { error: 'Unauthorized. Please log in.' };

    try {
      const res = await fetch(`http://localhost:5500/questions/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedFields),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        return { error: data.error || 'Failed to update question.' };
      }

      return { success: data.success };
    } catch (error) {
      console.error('Error editing question:', error);
      return { error: 'Something went wrong. Please try again.' };
    }
  };

  const deleteQuestion = async (id: string) => {
    const token = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
    if (!token) return { error: 'Unauthorized. Please log in.' };

    try {
      const res = await fetch(`http://localhost:5500/questions/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      return data;
    } catch (err) {
      console.error('Delete error:', err);
      return { error: 'Failed to delete question. Please try again later.' };
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
    getFilteredDataAmount();
  }, []);

  return (
    <QuestionsContext.Provider
      value={{
        questions,
        loading,
        filteredDataAmount,
        changePage,
        changePageSize,
        applySort: changeSort,
        applyFilter,
        resetFilters,
        fetchQuestions,
        createQuestion,
        editQuestion,
        deleteQuestion,
        dispatch,
        getQuestionById,
        currentPage: currentPageRef,
        pageSize: pageSizeRef,
      }}
    >
      {children}
    </QuestionsContext.Provider>
  );
};

export { QuestionsProvider };
export default QuestionsContext;