/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
/* eslint-disable react/prop-types */
import React, { useState, useContext } from "react";
import { RecipesContext } from "./RecipeProvider";
import axios from "axios";

export const UserContext = React.createContext();

const userAxios = axios.create();

userAxios.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default function UserProvider({ children }) {
  const initState = {
    user: JSON.parse(localStorage.getItem("user")) || {},
    token: localStorage.getItem("token") || "",
    recipes: [],
    errMsg: "",
  };

  const [userState, setUserState] = useState(initState);

  function signup(credentials) {
    axios
      .post("/auth/signup", credentials)
      .then((res) => {
        if (res && res.data) {
          const { user, token } = res.data;
          localStorage.setItem("token", token); //save the token data and not lose it after browser refresh
          localStorage.setItem("user", JSON.stringify(user));
          setUserState((prevUserState) => ({
            ...prevUserState,
            user,
            token,
          }));
        }
      })

      .catch((err) => handleAuthErr(err.response.data.errMsg));
  }

  // Login user
  function login(credentials) {
    axios
      .post("/auth/login", credentials)

      .then((res) => {
        console.log(res.data);
        const { user, token } = res.data;
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
        // getpublicRecipes();
        setUserState((prevUserState) => ({
          ...prevUserState,
          user,
          token,
        }));
      })
      .catch((err) => console.log(err));
  }

  // Logout user
  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUserState({
      user: {},
      token: "",
      recipes: [],
      errMsg: "",
    });
  }

  // error handling
  function handleAuthErr(errMsg) {
    setUserState((prevUserState) => ({
      ...prevUserState,
      errMsg,
    }));
  }

  // reset Auth error
  function resetAuthErr() {
    setUserState((prevUserState) => ({
      ...prevUserState,
      errMsg: "",
    }));
  }

  // Update user information
  function updateUser(updatedUser) {
    userAxios
      .put("/api/user", updatedUser)
      .then((res) => {
        localStorage.setItem("user", JSON.stringify(res.data));
        setUserState((prevUserState) => ({
          ...prevUserState,
          user: res.data,
        }));
      })
      .catch((err) => console.log(err));
  }

  return (
    <UserContext.Provider
      value={{ ...userState, signup, login, logout, resetAuthErr, updateUser }}
    >
      {children}
    </UserContext.Provider>
  );
}
