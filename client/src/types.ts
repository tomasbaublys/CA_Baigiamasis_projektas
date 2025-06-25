import { ReactElement } from 'react';

export type ChildrenProp = {
  children: ReactElement;
};

export type User = {
  _id: string;
  email: string;
  username: string;
  password: string;
  profilePicture: string;
  createdAt: string;
};

export type UsersReducerActionTypes =
  | { type: 'setUser'; userData: Omit<User, 'password'> }
  | { type: 'logoutUser' }
  | { type: 'registerUser'; userData: Omit<User, 'password'> };

export type UsersContextTypes = {
  loggedInUser: Omit<User, 'password'> | null;
  loginUser: (
    userData: Pick<User, 'email' | 'password'>,
    stayLoggedIn: boolean
  ) => Promise<{ error: string } | { success: string }>;
  logoutUser: () => void;
  registerUser: (
    userData: Pick<User, 'email' | 'password' | 'username' | 'profilePicture'>,
    stayLoggedIn: boolean
  ) => Promise<{ error: string } | { success: string }>;
  editUser: (
    userData: Partial<Omit<User, '_id' | 'email' | 'createdAt' | 'password'>> & {
      password?: string;
      oldPassword?: string;
    },
    id: string
  ) => Promise<{ error: string } | { success: string }>;
  getUserId: () => Promise<{ error: string } | { id: string }>;
  decodeFromToken: () => Omit<User, 'password'> | null;
  dispatch: React.Dispatch<UsersReducerActionTypes>;
};

export type EditableUser = Omit<User, '_id' | 'createdAt' | 'password'> & {
  oldPassword?: string;
  password?: string;
  passwordConfirm?: string;
};

export type FormInputProps = {
  labelHtmlFor: string;
  labelText: string;
  inputType: string;
  inputName: string;
  inputId: string;
  inputValue: string;
  inputPlaceholder?: string;
  errors?: string;
  touched?: boolean;
  inputOnChange?: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  inputOnBlur?: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
};

export type Question = {
  _id: string;
  title: string;
  description: string;
  tags: string[];
  author: {
    _id: string;
    username: string;
    profilePicture: string;
  };
  likes: string[];
  dislikes: string[];
  score: number;
  createdAt: string;
  updatedAt: string;
};

export type QuestionsReducerActionTypes =
  | { type: 'setQuestions'; questionData: Question[] }
  | { type: 'addQuestion'; questionData: Question };

export type QuestionsContextTypes = {
  questions: Question[];
  applySort: (value: string) => void;
  applyFilter: (values: QuestionsFilterValues) => void;
  resetFilters: () => void;
  loading: boolean;
  fetchQuestions: () => Promise<void>; 
  createQuestion: (
    questionData: Pick<Question, 'title' | 'description' | 'tags' | 'author'>
  ) => Promise<{ error: string } | { success: string; newQuestionId: string }>;
  getQuestionById: (id: string) => Promise<{ error: string } | { question: Question }>;
  editQuestion: (
    id: string,
    updatedFields: Partial<Pick<Question, 'title' | 'description' | 'tags'>>
  ) => Promise<{ error: string } | { success: string }>;
  deleteQuestion: (id: string) => Promise<{ success?: string; error?: string }>;
  dispatch: React.Dispatch<QuestionsReducerActionTypes>;
};

export type QuestionsFilterValues = {
  title?: string;
  tag?: string;
  createdAt_gte: string;
  createdAt_lte: string;
};

export type Answer = {
  _id: string;
  questionId: string;
  userId: string;
  username: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  edited: boolean;
};

export type AnswersReducerActionTypes =
  | { type: 'setAnswers'; answers: Answer[] }
  | { type: 'addAnswer'; answer: Answer }
  | { type: 'updateAnswer'; answer: Answer }
  | { type: 'deleteAnswer'; id: string };

export type AnswersContextTypes = {
  answers: Answer[];
  getAnswersByQuestionId: (questionId: string) => Promise<void>;
  postAnswer: (questionId: string, content: string) => Promise<void>;
  editAnswer: (answerId: string, content: string) => Promise<void>;
  deleteAnswer: (answerId: string) => Promise<void>;
  dispatch: React.Dispatch<AnswersReducerActionTypes>;
};