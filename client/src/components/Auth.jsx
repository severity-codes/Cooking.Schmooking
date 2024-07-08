/* eslint-disable no-unused-vars */
/* eslint-disable react/no-unescaped-entities */
import React, { useState, useContext } from "react";
import AuthForm from './AuthForm'
import { UserContext } from "../context/UserProvider";

// import Logo from "../Logo/Logo.jsx";


const initInputs = {
  username: "",
  password: "",
};

export default function Auth() {
  const [inputs, setInputs] = useState(initInputs);
  const [toggle, setToggle] = useState(false);

  const { signup, login, errMsg, resetAuthErr } = useContext(UserContext);

  function handleChange(e) {
    const { name, value } = e.target;
    setInputs((prevInputs) => ({
      ...prevInputs,
      [name]: value,
    }));
  }

  function handleSignup(e) {
    e.preventDefault();
    signup(inputs);
  }

  function handleLogin(e) {
    e.preventDefault();
    login(inputs);
  }

  function toggleForm() {
    setToggle((prev) => !prev);
    resetAuthErr();
  }

  return (
    <div className="auth-container">
      <div className="auth-wrapper">
        {" "}
        {toggle ? (
          <>
            {/* <Logo /> */}
            <h1> Create your VIP account </h1>{" "}
            <p>
              Already have an account ?{" "}
              <span className="auth-span" onClick={toggleForm}>
                {" "}
                Log in .{" "}
              </span>{" "}
            </p>{" "}
            <AuthForm
              handleChange={handleChange}
              handleSubmit={handleSignup}
              inputs={inputs}
              errMsg={errMsg}
              btnText="Create Account"
            />
          </>
        ) : (
          <>
            {/* <Logo /> */}
            <h1> Log in to your VIP account </h1>{" "}
            <p>Don't have an account?{" "}
              <span className="auth-span" onClick={toggleForm}>
                Sign up.
              </span>{" "}
            </p>{" "}
            <AuthForm
              handleChange={handleChange}
              handleSubmit={handleLogin}
              inputs={inputs}
              errMsg={errMsg}
              btnText="Log In"
            />
          </>
        )}{" "}
      </div>{" "}
    </div>
  );
}
