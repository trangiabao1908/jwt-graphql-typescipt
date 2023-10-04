import React, { createContext, useCallback, useState } from "react";
import authToken from "../utils/authToken";

export interface AuthContextType {
  isAuthenticated: boolean;
  SetIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
  verifyAuth: () => Promise<void>;
}
export interface Props {
  children: React.ReactNode;
}
const AuthContextDefault = {
  isAuthenticated: false,
  SetIsAuthenticated: () => {},
  verifyAuth: () => Promise.resolve(),
};
export const AuthContext = createContext<AuthContextType>(AuthContextDefault);
const AuthProvider: React.FC<Props> = (props) => {
  const { children } = props;
  const [isAuthenticated, SetIsAuthenticated] = useState(
    AuthContextDefault.isAuthenticated
  );
  const verifyAuth = useCallback(async () => {
    const token = authToken.getToken();
    if (token) {
      SetIsAuthenticated(true);
    } else {
      const isSuccessGetRefreshToken = await authToken.getRefreshToken();
      isSuccessGetRefreshToken && SetIsAuthenticated(true);
    }
  }, []);
  const AuthContextValue: AuthContextType = {
    isAuthenticated,
    SetIsAuthenticated,
    verifyAuth,
  };
  return (
    <AuthContext.Provider value={AuthContextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
