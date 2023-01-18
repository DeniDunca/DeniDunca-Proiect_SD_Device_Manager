import {useContext} from "react";
import AuthContext from "../../store/auth-context";
import classes from "./Admin.module.css";
import {NavLink} from "react-router-dom";

const Admin = () => {
    const loginCtx = useContext(AuthContext);

    const logOutHandler = () => {
        loginCtx.onLogout();
    }

    return(
        <div>
            <h1 className={classes.h1}>Welcome to the Administration Page!</h1>
            <div className={classes.topnav}>
                <NavLink to={'/manageUsers'}>Manage Users</NavLink>
                <NavLink to={'/manageDevices'}>Manage Devices</NavLink>
                <NavLink to={'/adminChat'}>Chat</NavLink>
                <button onClick={logOutHandler}>Log out</button>
            </div>
        </div>
    );
}
export default Admin;