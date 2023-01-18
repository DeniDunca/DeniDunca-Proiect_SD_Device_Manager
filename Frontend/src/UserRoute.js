import { Navigate } from "react-router-dom";
import AuthContext from "./store/auth-context";

const {useContext} = require("react");
const {Outlet} = require("react-router-dom");

const UserRoute = () => {
    const loginCtx = useContext(AuthContext);

    return loginCtx.role === 2 ? <Outlet/> : <Navigate to="/admin"/>
};

export default UserRoute;