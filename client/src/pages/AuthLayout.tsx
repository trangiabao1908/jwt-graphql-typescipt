import React, { useContext, useEffect, useState } from "react";
import { Link, Outlet } from "react-router-dom";
import { AuthContext, AuthContextType } from "../contexts/AuthProvider";
import authToken from "../utils/authToken";
import { graphql } from "../gql/index";
import { useMutation } from "@apollo/client";

const LOGOUT_TASK = graphql(
  "mutation Logout($userId: ID!) {\n  logout(userId: $userId) {\n    code\n    success\n  }\n}"
);
const AuthLayout: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { verifyAuth, isAuthenticated, SetIsAuthenticated } =
    useContext<AuthContextType>(AuthContext);

  useEffect(() => {
    const getVerifyAuth = async () => {
      await verifyAuth();
      setIsLoading(false);
    };
    getVerifyAuth();
  }, [verifyAuth]);
  const [logout] = useMutation(LOGOUT_TASK);
  const handleLogout = async () => {
    authToken.deleteToken();
    SetIsAuthenticated(false);
    await logout({
      variables: {
        userId: authToken.getUserId()?.toString() as string,
      },
    });
  };
  if (isLoading) {
    return <h1 className="text-3xl">Loading....</h1>;
  }
  console.log(isLoading);
  return (
    <React.Fragment>
      <div className="flex flex-col justify-center items-center mt-[50px]">
        <h1 className="text-3xl">JWT GRAPHQL TYPESCRIPT</h1>
        <nav className="mt-10 w-full border-b-2 border-gray-400 text-center pb-4">
          <Link to="." className="mr-3  text-lg underline">
            Home
          </Link>
          <Link to="login" className="mr-3  text-lg underline">
            Login
          </Link>
          <Link to="register" className="mr-3  text-lg underline">
            Register
          </Link>
          <Link to="profile" className="mr-3  text-lg underline">
            Profile
          </Link>
          {isAuthenticated && (
            <button
              type="button"
              onClick={handleLogout}
              className="bg-slate-400 rounded-lg p-[2px] border-2 border-slate-400 text-lg"
            >
              Logout
            </button>
          )}
        </nav>
        <div className="mt-[50px]">
          <Outlet></Outlet>
        </div>
      </div>
    </React.Fragment>
  );
};

export default AuthLayout;
