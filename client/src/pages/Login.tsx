import { useMutation } from "@apollo/client";
import React, { useContext, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { AuthContext, AuthContextType } from "../contexts/AuthProvider";
import { graphql } from "../gql/index";
import authToken from "../utils/authToken";
const Login_TASK = graphql(
  "mutation Login($loginInput: LoginInput!) {\n  login(loginInput: $loginInput) {\n    accessToken\n    code\n    message\n    success\n  }\n}"
);
export const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { isAuthenticated, SetIsAuthenticated } =
    useContext<AuthContextType>(AuthContext);
  const [login] = useMutation(Login_TASK);
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const res = await login({
        variables: {
          loginInput: {
            username,
            password,
          },
        },
      });
      if (res.data?.login.success === true) {
        authToken.setToken(res.data.login.accessToken as string);
        const token = authToken.getToken();
        if (token) {
          SetIsAuthenticated(true);
        }
        setUsername("");
        setPassword("");
        setError("");
        navigate("..");
      } else {
        if (res.data?.login.message) {
          setError(res.data?.login.message);
        }
      }
    } catch (error) {
      return console.log(error);
    }
  };
  const token = authToken.getToken();

  if (isAuthenticated && token) {
    return <Navigate to={"/"} />;
  }
  return (
    <React.Fragment>
      <div>
        <div className="text-center mb-4">
          {error && <h3 className="text-red-600 text-2xl">{error}</h3>}
        </div>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Nhap vao user"
            className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg  p-2 mr-3"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          ></input>
          <input
            type="password"
            placeholder="Nhap vao password"
            className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg p-2 mr-3"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          ></input>
          <button
            type="submit"
            className={`border-2 rounded-lg p-2 border-black w-[70px] bg-black text-white hover:bg-slate-400 hover:border-slate-400`}
          >
            Login
          </button>
        </form>
      </div>
    </React.Fragment>
  );
};
