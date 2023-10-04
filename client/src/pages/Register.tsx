import React, { useState } from "react";
import { graphql } from "../gql/index";
import { useMutation } from "@apollo/client";
import { useNavigate } from "react-router-dom";

interface RegisterType {
  username: string;
  password: string;
}
const Register = () => {
  const REGISTER_TASK = graphql(
    "mutation Register($registerInput: RegisterInput!) {\n  register(registerInput: $registerInput) {\n    code\n    message\n    success\n    user {\n      id\n      username\n    }\n  }\n}"
  );
  const [register] = useMutation(REGISTER_TASK);
  const [registerInputValue, setRegisterInputValue] = useState<RegisterType>({
    username: "",
    password: "",
  });
  const { username, password } = registerInputValue;
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const handleChangeRegisterValue = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRegisterInputValue({
      ...registerInputValue,
      [event.target.name]: event.target.value,
    });
  };
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const res = await register({
        variables: {
          registerInput: registerInputValue,
        },
      });
      if (res.data?.register.success) {
        setRegisterInputValue({
          username: "",
          password: "",
        });
        setError("");
        navigate("..");
      } else {
        if (res.data?.register.message) {
          setError(res.data?.register.message);
        }
      }
      console.log(res);
    } catch (err) {
      console.log(err);
    }
  };
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
            name="username"
            onChange={handleChangeRegisterValue}
          ></input>
          <input
            type="password"
            placeholder="Nhap vao password"
            className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg p-2 mr-3"
            value={password}
            name="password"
            onChange={handleChangeRegisterValue}
          ></input>
          <button
            type="submit"
            className={`border-2 rounded-lg p-2 border-black w-[70px] bg-black text-white hover:bg-slate-400 hover:border-slate-400`}
          >
            Register
          </button>
        </form>
      </div>
    </React.Fragment>
  );
};

export default Register;
