import React, {useState} from "react";
import AuthContext from "./auth-context";
import {useCookies} from "react-cookie";

const defaultAuthState = {
    isAuthenticated: false,
    role:-1,
    userId: -1,
    logInError: false
}

const AuthProvider = (props) => {
    const [cookies, setCookie] = useCookies(['access_token','user_id']);
    const [isLoggedIn, setIsLoggedIn] = useState(defaultAuthState);

    const loginHandler = async (name, password) => {
       const fetchLogin = async () => {
           const response = await fetch('http://localhost:8080/api/v1/auth/authenticate', {
               method: 'POST',
               headers: {
                   'Accept': 'application/json',
                   'Content-Type': 'application/json',
               },
               body: JSON.stringify({
                   name: name,
                   password: password
               })
           });
           if (!response.ok) {
               throw new Error('Something went wrong!');
           }

           const responseData = await response.json();
           localStorage.setItem('token', responseData.password);

           setIsLoggedIn({
               isAuthenticated: true,
               userId: responseData.id,
               role: responseData.role,
               logInError: false
           });

           setCookie('access_token',responseData.role);
           setCookie('user_id',responseData.id);
       }
        fetchLogin().catch((error) => {
            setIsLoggedIn({...isLoggedIn, logInError: true});
        })
    };

    const logoutHandler = () => {
        localStorage.setItem('token','');
        setIsLoggedIn({
            isAuthenticated: false,
            userId: -1,
            role: -1,
            logInError: false
        })

        setCookie('access_token',-1);
        setCookie('user_id',-1);
    }

    const setNoLogInError = () => {
        setIsLoggedIn({...isLoggedIn, logInError: false});
    }

    const setDataFromCookies = () => {
        if(cookies.access_token === -1)
            return;

        setIsLoggedIn({
            isAuthenticated: true,
            userId: parseInt(cookies.user_id),
            role: parseInt(cookies.access_token),
            logInError: false
        });
    }

    const authContext = {
        isAuthenticated: isLoggedIn.isAuthenticated,
        userId: isLoggedIn.userId,
        role: isLoggedIn.role,
        logInError: isLoggedIn.logInError,
        onLogin: loginHandler,
        onLogout: logoutHandler,
        setLogInError: setNoLogInError,
        setCookieData: setDataFromCookies
    }

    return <AuthContext.Provider value={authContext}>
        {props.children}
    </AuthContext.Provider>
}
export default AuthProvider;