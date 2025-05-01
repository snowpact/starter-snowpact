import { useQueryClient } from '@tanstack/react-query';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import React, { createContext, PropsWithChildren, useContext, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { configureAxios } from '@/configs/axios';

export type UserType = {
  userId: string;
  isAdmin: boolean;
  name: string;
  email: string;
};

type AuthContextType = {
  user: UserType | null;
  isReady: boolean;
  saveToken: (accessToken: string, refreshToken: string) => void;
  clearUser: () => void;
};

const initialContext: AuthContextType = {
  user: null,
  isReady: false,
  saveToken: () => {},
  clearUser: () => {},
};

const getInitialUser = (): UserType | null => {
  const accessToken = Cookies.get('at');
  if (!accessToken) {
    return null;
  }
  const decoded = jwtDecode(accessToken) as UserType;
  return decoded;
};

export const AuthContext = createContext<AuthContextType>(initialContext);

export const AuthProvider: React.FC<PropsWithChildren> = ({ children }) => {
  // we are setting it to true because we are initializing the user at first render with the getInitialUser function
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isReady, _setIsReady] = useState(true);
  const [user, setUser] = useState<UserType | null>(getInitialUser());
  const isAxiosConfigured = useRef(false);

  const { t } = useTranslation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const clearUser = () => {
    Cookies.remove('at');
    Cookies.remove('rt');

    setUser(null);

    queryClient.removeQueries();
    navigate('/login');
  };

  const saveToken = (accessToken: string, refreshToken: string) => {
    Cookies.set('at', accessToken);
    Cookies.set('rt', refreshToken);

    const jwt = jwtDecode(accessToken) as UserType;

    // TODO update
    setUser({
      userId: jwt.userId,
      isAdmin: false,
      name: 'John Doe',
      email: 'john.doe@example.com',
    });
  };

  if (!isAxiosConfigured.current) {
    configureAxios({
      onTokenError: () => {
        clearUser();
      },
      translate: t,
    });

    isAxiosConfigured.current = true;
  }

  const contextValue: AuthContextType = {
    user: user,
    saveToken,
    clearUser,
    isReady,
  };

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('AuthContext must be within AuthProvider');
  }

  return context;
};
