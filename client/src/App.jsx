/* eslint-disable no-unused-vars */
import React, { useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import NavBar from "./components/NavBar";
import Auth from "./components/Auth";
import Profile from "./components/Profile";
import MealDetails from "./components/MealDetails";
import { UserContext } from "./context/UserProvider";
import Home from "./components/Home";
import "./App.css";

export default function App() {
  const { token, logout } = useContext(UserContext);

  return (
    <div className="app">
      {localStorage.getItem("token") && <NavBar logout={logout} />}
      <Routes>
        {localStorage.getItem("token") ? (
          <>
            <Route path="/" element={<Home />} />
            <Route path="/profile" element={<Profile />} />
            jsx
            <Route path="/meal/:mealId" element={<MealDetails />} />
          </>
        ) : (
          <Route path="*" element={<Auth />} />
        )}
      </Routes>
    </div>
  );
}
