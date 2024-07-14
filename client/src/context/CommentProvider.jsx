import React, { useState, useCallback } from "react";
import axios from "axios";
import PropTypes from "prop-types";

// Create CommentContext
export const CommentContext = React.createContext();

// Create axios instance with request interceptor
const userAxios = axios.create();
userAxios.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

const CommentProvider = ({ children }) => {
  const initState = {
    comments: [],
    errMsg: "",
  };

  const [commentState, setCommentState] = useState(initState);

  const addComment = useCallback(async (recipeId, newComment) => {
    try {
      console.log("Adding comment with payload:", { recipeId, ...newComment });
      const res = await userAxios.post(`/api/comment/${recipeId}`, newComment);
      setCommentState((prevState) => ({
        ...prevState,
        comments: [...prevState.comments, res.data],
        errMsg: "",
      }));
    } catch (err) {
      console.error("Error adding comment:", err);
      if (err.response) {
        console.error("Response data:", err.response.data);
        console.error("Response status:", err.response.status);
        console.error("Response headers:", err.response.headers);
        setCommentState((prevState) => ({
          ...prevState,
          errMsg: err.response.data.message || "Failed to add comment.",
        }));
      } else if (err.request) {
        console.error("Request data:", err.request);
      } else {
        console.error("Error message:", err.message);
      }
    }
  }, []);

  const getComments = useCallback(async (recipeId) => {
    try {
      const response = await userAxios.get(`/api/comment/${recipeId}`);
      setCommentState((prevState) => ({
        ...prevState,
        comments: response.data,
        errMsg: "",
      }));
    } catch (err) {
      console.error("Error fetching comments:", err);
      if (err.response) {
        console.error("Response data:", err.response.data);
        console.error("Response status:", err.response.status);
        console.error("Response headers:", err.response.headers);
        setCommentState((prevState) => ({
          ...prevState,
          errMsg:
            err.response.data.message ||
            "An error occurred while fetching comments.",
        }));
      } else if (err.request) {
        console.error("Request data:", err.request);
      } else {
        console.error("Error message:", err.message);
      }
    }
  }, []);

  const editComment = useCallback(
    async (recipeId, commentId, updatedComment) => {
      try {
        const res = await userAxios.put(
          `/api/comment/${recipeId}/${commentId}`,
          updatedComment
        );
        setCommentState((prevState) => ({
          ...prevState,
          comments: prevState.comments.map((comment) =>
            comment._id === commentId ? res.data : comment
          ),
          errMsg: "",
        }));
      } catch (err) {
        console.error("Error updating comment:", err);
        if (err.response) {
          console.error("Response data:", err.response.data);
          console.error("Response status:", err.response.status);
          console.error("Response headers:", err.response.headers);
          setCommentState((prevState) => ({
            ...prevState,
            errMsg: err.response.data.message || "Failed to update comment.",
          }));
        } else if (err.request) {
          console.error("Request data:", err.request);
        } else {
          console.error("Error message:", err.message);
        }
      }
    },
    []
  );

  const deleteComment = useCallback(async (recipeId, commentId) => {
    try {
      await userAxios.delete(`/api/comment/${recipeId}/${commentId}`);
      setCommentState((prevState) => ({
        ...prevState,
        comments: prevState.comments.filter(
          (comment) => comment._id !== commentId
        ),
        errMsg: "",
      }));
    } catch (err) {
      console.error("Error deleting comment:", err);
      if (err.response) {
        console.error("Response data:", err.response.data);
        console.error("Response status:", err.response.status);
        console.error("Response headers:", err.response.headers);
        setCommentState((prevState) => ({
          ...prevState,
          errMsg: err.response.data.message || "Failed to delete comment.",
        }));
      } else if (err.request) {
        console.error("Request data:", err.request);
      } else {
        console.error("Error message:", err.message);
      }
    }
  }, []);

  return (
    <CommentContext.Provider
      value={{
        ...commentState,
        addComment,
        getComments,
        editComment,
        deleteComment,
      }}
    >
      {children}
    </CommentContext.Provider>
  );
};

CommentProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default CommentProvider;
