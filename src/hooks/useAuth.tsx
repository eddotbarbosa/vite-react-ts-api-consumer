import {useContext} from "react";

import {authContext} from "../contexts/authContext";

const useAuth = function () {
  const context = useContext(authContext);

  if (!context) throw new Error('useAuth must be inside an authProvider!');

  const {auth, setAuth, signIn, signOut} = context;

  return {auth, setAuth, signIn, signOut};
};

export {useAuth};
