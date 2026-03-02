import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [loggedin, setLoggedin] = useState(() => {
    const userStr = localStorage.getItem("user");
    if (!userStr) return false;
    try {
      const user = JSON.parse(userStr);
      return !!user.token;
    } catch (e) {
      return false;
    }
  });
  const navigate = useNavigate();

  const login = () => {
    setLoggedin(true);
  };

  const logout = async () => {
    try {
      const response = await axios.get("http://localhost:6767/api/v1/user/logout", {
        withCredentials: true,
      });
      setLoggedin(false);
      localStorage.removeItem("user");
      toast.success(response.data.message);
      navigate("/");
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Error in logout");
    }
  };

  return (
    <AuthContext.Provider value={{ loggedin, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};