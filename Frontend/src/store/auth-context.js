import React from "react";

const AuthContext = React.createContext({
    isAuthenticated: false,
    role: -1,
    userId: -1,
    onLogin: (name, password) => {},
    onLogout: () => {},
    setLogInError: () => {},
    setCookieData: () => {}
});

export default AuthContext;