import jwtDecode from "jwt-decode";
import React, {createContext, useState, useEffect} from "react";

import api from '../services/api';

interface AuthProviderProps {
  children?: React.ReactNode;
}

interface AuthContextType {
  auth: boolean;
  setAuth: React.Dispatch<React.SetStateAction<boolean>>;
  signIn: (email: string, password: string, callback: VoidFunction) => Promise<void>;
  signOut: (callback: VoidFunction) => void;
}

export const authContext = createContext<AuthContextType | undefined>(undefined);

const AuthProvider = function ({children}: AuthProviderProps): JSX.Element | null{
  const [auth, setAuth] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const token = localStorage.getItem('authorization');

    if (token) {
      api.defaults.headers.common['authorization'] = token;
      setAuth(true);
    }

    return setIsLoading(false);
  }, []);

  const signIn = async function (email: string, password: string, callback: VoidFunction): Promise<void> {
    const signIn = await api.post('/auth/signin', {
      email: email,
      password: password
    });

    if (!signIn.data.token) {
      return console.log({error: signIn.data.error});
    }

    const token = signIn.data.token;

    localStorage.setItem('authorization', token);

    api.defaults.headers.common['authorization'] = token;

    setAuth(true);

    return callback();
  }

  const signOut = function (callback: VoidFunction) {
    const token = localStorage.getItem('authorization');

    if (!token) return console.log('you do not have an authorization!');

    localStorage.removeItem('authorization');

    api.defaults.headers.common['authorization'] = '';

    setAuth(false);

    return callback();
  }

  if (isLoading) {
    return null;
  }

  return (
    <authContext.Provider value={{auth, setAuth, signIn, signOut}}>
      {children}
    </authContext.Provider>
  );
};

export {AuthProvider};
