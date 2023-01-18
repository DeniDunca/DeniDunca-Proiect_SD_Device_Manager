import {useContext} from "react";
import AuthContext from "../../store/auth-context";

import {NavLink} from "react-router-dom";
import classes from "./User.module.css";

const User = () => {
    const loginCtx = useContext(AuthContext);

    const logOutHandler = () => {
        loginCtx.onLogout();
    }

    return(
        <div>
            <h1 className={classes.h1}>Welcome!</h1>
            <div className={classes.topnav}>
                <NavLink to={'/seeDevices'}>My Devices</NavLink>
                <NavLink to={'/consumption'}>Consumption</NavLink>
                <NavLink to={'/userChat'}>Chat</NavLink>
                <button onClick={logOutHandler}>Log out</button>
            </div>
        </div>
    );
}
export default User;