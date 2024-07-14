import React, { useState } from "react";
import axios from "axios";

export const UserContext = React.createContext();

const userAxios = axios.create();

userAxios.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  config.headers.Authorization = `Bearer ${token}`;
  return config;
});

const storage = {
  getUser: () => JSON.parse(localStorage.getItem("user")),
  getToken: () => localStorage.getItem("token"),
  setUser: (user) => localStorage.setItem("user", JSON.stringify(user)),
  setToken: (token) => localStorage.setItem("token", token),
  clear: () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  },
};

export default function UserProvider({ children }) {
  const initState = {
    user: storage.getUser() || {},
    token: storage.getToken() || "",
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
          storage.setUser(user);
          storage.setToken(token);
          setUserState((prevUserState) => ({
            ...prevUserState,
            user,
            token,
          }));
        }
      })
      .catch((err) => handleAuthErr(err.response.data.errMsg));
  }

  function login(credentials) {
    axios
      .post("/auth/login", credentials)
      .then((res) => {
        if (res && res.data) {
          const { user, token } = res.data;
          storage.setUser(user);
          storage.setToken(token);
          setUserState((prevUserState) => ({
            ...prevUserState,
            user,
            token,
          }));
        }
      })
      .catch((err) => handleAuthErr(err.response ? err.response.data.errMsg : "Login failed"));
  }

  function logout() {
    storage.clear();
    setUserState({
      user: {},
      token: "",
      recipes: [],
      errMsg: "",
    });
  }

  function handleAuthErr(errMsg) {
    setUserState((prevUserState) => ({
      ...prevUserState,
      errMsg,
    }));
  }

  function resetAuthErr() {
    setUserState((prevUserState) => ({
      ...prevUserState,
      errMsg: "",
    }));
  }

  // Assuming updateUser function definition was intended from prior code context
  function updateUser(updatedUser) {
    userAxios
      .put("/api/user", updatedUser)
      .then((res) => {
        if (res && res.data) {
          storage.setUser(res.data);
          setUserState((prevUserState) => ({
            ...prevUserState,
            user: res.data,
          }));
        }
      })
      .catch((err) =>
        handleAuthErr(
          err.response ? err.response.data.errMsg : "Update failed"
        )
      );
  }

  return (
    <UserContext.Provider
      value={{ ...userState, signup, login, logout, resetAuthErr, updateUser }}
    >
      {children}
    </UserContext.Provider>
  );
}
