import { createContext, useContext, useEffect, useState, useCallback } from "react";



// Creating a context 
const AuthContext = createContext();

// Creating a context provider

const AuthContextProvider = ({children}) => {

    const user = {name:"Abhi", age:22}

  return (
    <AuthContext.Provider value={user}>
        {children}
    </AuthContext.Provider>
  )
}




// Creating a hook
export const useAuth = () => {
    const context = useContext(AuthContext);
    return context;
}
