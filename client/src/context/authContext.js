import { createContext, useEffect, useState } from "react";
import axios from "axios"

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );

  const login = async (inputs) => {
    console.log("inputs context", inputs);
    //TO DO
    const res =  await axios.post('http://localhost:8080/api/auth/login', inputs, {
      withCredentials: true //cho biết có hay không yêu cầu Kiểm soát truy cập chéo trang
    })
    setCurrentUser(res.data);
    
  };

  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(currentUser));
  }, [currentUser]);

  return (
    <AuthContext.Provider value={{ currentUser, setCurrentUser, login }}>
      {children}
    </AuthContext.Provider>
  );
};
