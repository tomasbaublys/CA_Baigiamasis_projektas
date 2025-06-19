import { createContext, useEffect, useReducer } from 'react';
import { jwtDecode } from "jwt-decode";

import { ChildrenProp, User, UsersReducerActionTypes, UsersContextTypes } from '../../types';

type LoggedInUser = UsersContextTypes['loggedInUser'];

const reducer = (state: LoggedInUser, action: UsersReducerActionTypes): LoggedInUser => {
  switch (action.type) {
    case 'setUser':
    case 'registerUser':
      return action.userData;
    case 'logoutUser':
      return null;
    default:
      return state;
  }
};

const UsersContext = createContext<UsersContextTypes | undefined>(undefined);

const UsersProvider = ({ children }: ChildrenProp) => {
  const [loggedInUser, dispatch] = useReducer(reducer, null);

  const decodeFromToken = () => {
    const token = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
    if (!token) return null;

    try {
      return jwtDecode<Omit<User, '_id' | 'password'>>(token);
    } catch (err) {
      console.error(`Invalid access token: ${err}`);
      return null;
    }
  };

  const loginUser = async (userData: Pick<User, 'email' | 'password'>, stayLoggedIn: boolean) => {
    const serverResponse = await fetch('http://localhost:5500/users/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });

    if (!serverResponse.ok) {
      const { error } = await serverResponse.json();
      return { error };
    }

    const token = serverResponse.headers.get('Authorization');
    if (token) {
      if (stayLoggedIn) {
        localStorage.setItem('accessToken', token);
      } else {
        sessionStorage.setItem('accessToken', token);
      }
    }

    const { success, userData: user } = await serverResponse.json();
    dispatch({ type: 'setUser', userData: user });
    return { success };
  };

  const registerUser = async (userData: Omit<User, '_id'>, stayLoggedIn: boolean) => {
    const serverResponse = await fetch('http://localhost:5500/users/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });

    if (!serverResponse.ok) {
      const { error } = await serverResponse.json();
      return { error };
    }

    const token = serverResponse.headers.get('Authorization');
    if (token) {
      if (stayLoggedIn) {
        localStorage.setItem('accessToken', token);
      } else {
        sessionStorage.setItem('accessToken', token);
      }
    }

    const { success, userData: user } = await serverResponse.json();
    dispatch({ type: 'registerUser', userData: user });
    return { success };
  };

  const editUser = async (
    userData: Partial<Omit<User, '_id' | 'email' | 'createdAt' | 'password'>> & { password?: string; oldPassword?: string },
    id: string
  ) => {
    const serverResponse = await fetch(`http://localhost:5500/users/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });

    if (!serverResponse.ok) {
      const { error } = await serverResponse.json();
      return { error };
    }

    const { success, userData: updatedUser, updatedToken } = await serverResponse.json();

    if (updatedToken) {
      localStorage.setItem('accessToken', updatedToken);
    }

    dispatch({ type: 'setUser', userData: updatedUser });
    return { success };
  };

  const getUserId = async () => {
    const token = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
    if (!token) return { error: 'No token exists.' };

    const serverResponse = await fetch('http://localhost:5500/users/id', {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!serverResponse.ok) {
      const { error } = await serverResponse.json();
      return { error };
    }

    const { id } = await serverResponse.json();
    return { id };
  };

  const logoutUser = () => {
    dispatch({ type: 'logoutUser' });
    localStorage.removeItem('accessToken');
    sessionStorage.removeItem('accessToken');
  };

  useEffect(() => {
    const token = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
    if (token) {
      fetch('http://localhost:5500/users/login-auto', {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then(serverResponse => serverResponse.json())
        .then(data => {
          if ('error' in data) {
            console.error('Auto-login failed:', data.error);
            localStorage.removeItem('accessToken');
          } else {
            dispatch({ type: 'setUser', userData: data.userData });
          }
        });
    }
  }, []);

  return (
    <UsersContext.Provider
      value={{
        loggedInUser,
        loginUser,
        logoutUser,
        registerUser,
        decodeFromToken,
        getUserId,
        editUser,
        dispatch,
      }}
    >
      {children}
    </UsersContext.Provider>
  );
};

export { UsersProvider };
export default UsersContext;