import React from "react";
import { createRoot } from "react-dom/client"; // Updated import
import { BrowserRouter as Router } from "react-router-dom";
import App from "./App";
import UserProvider from "../src/context/UserProvider";
import RecipeProvider from "./context/RecipeProvider";
import CommentProvider from "./context/CommentProvider";
import "./style/style.css";

const rootElement = document.getElementById("root");
const root = createRoot(rootElement); 
root.render(
  <React.StrictMode>
    <Router>
      <CommentProvider>
        <RecipeProvider>
          <UserProvider>
            <App />
          </UserProvider>
        </RecipeProvider>
      </CommentProvider>
    </Router>
  </React.StrictMode>
);
