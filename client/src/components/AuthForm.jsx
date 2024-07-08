/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from "react";
// 

export default function AuthForm(props) {
  const {
    handleChange,
    handleSubmit,
    btnText,
    errMsg,
    inputs: { username, password },
  } = props;

  return (
    <form className="authForm" onSubmit={handleSubmit}>
      <input
        type="text"
        value={username}
        name="username"
        onChange={handleChange}
        placeholder="Username"
      />
      <input
        type="password"
        value={password}
        name="password"
        onChange={handleChange}
        placeholder="Password"
      />
      <button>{btnText}</button>
      <p style={{ color: "red" }}>{errMsg}</p>
    </form>
  );
}
