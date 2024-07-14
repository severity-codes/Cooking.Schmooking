import React from 'react';
import PropTypes from 'prop-types';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ token, children, redirectTo }) => (
  token ? children : <Navigate to={redirectTo} />
);

ProtectedRoute.propTypes = {
  token: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]).isRequired, // Allowing token to be a string or falsy value
  children: PropTypes.node.isRequired,
  redirectTo: PropTypes.string.isRequired,
};

export default ProtectedRoute;
