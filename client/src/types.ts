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