import { Navigate } from "react-router-dom";
import AuthContext from "./store/auth-context";

const {useContext} = require("react");
const {Outlet} = require("react-router-dom");

const PrivateRoute = () => {
    const loginCtx = useContext(AuthContext);

    return loginCtx.isAuthenticated ? <Outlet/> : <Navigate to="/login"/>
};

export default PrivateRoute;