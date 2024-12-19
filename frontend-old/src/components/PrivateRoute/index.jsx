import React from "react";
import { Navigate } from "react-router-dom";

function PrivateRoute ({ children }) {
  const isAuthenticated = localStorage.getItem("token"); // Vérifie la présence d'un token

  // Si l'utilisateur est authentifié, on affiche le composant children
  return isAuthenticated ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
