import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import App from "./App";
import UserProvider from "./context/UserProvider";
import RecipeProvider from "./context/RecipeProvider";
import CommentProvider from "./context/CommentProvider";
import "./style/style.css";

// Check if rootElement exists
const rootElement = document.getElementById("root");

if (rootElement) {
  const root = createRoot(rootElement);

  root.render(
    <React.StrictMode>
      <Router>
        <UserProvider>
          <RecipeProvider>
            <CommentProvider>
              <App />
            </CommentProvider>
          </RecipeProvider>
        </UserProvider>
      </Router>
    </React.StrictMode>
  );
} else {
  console.error(
    "Root element not found. Did you forget to add it to your HTML?"
  );
}
