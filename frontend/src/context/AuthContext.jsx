import React, { createContext, useState } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("userInfo");

    if (!storedUser) {
      return null;
    }

    try {
      return JSON.parse(storedUser);
    } catch {
      localStorage.removeItem("userInfo");
      return null;
    }
  });

  const login = (userData)=>{
    setUser(userData);
    localStorage.setItem("userInfo", JSON.stringify(userData));
  }

  const logout = ()=>{
    setUser(null);
    localStorage.removeItem("userInfo");
    sessionStorage.removeItem("checkoutAddress");
    sessionStorage.removeItem("paymentOrder");
  };

return(
    <AuthContext.Provider value={{user, login, logout}}>
     {children}
    </AuthContext.Provider>
)


}