import { Navigate } from "react-router-dom";
import AuthContext from "./store/auth-context";

const {useContext} = require("react");
const {Outlet} = require("react-router-dom");

const AdminRoute = () => {
    const loginCtx = useContext(AuthContext);

    return loginCtx.role === 1 ? <Outlet/> : <Navigate to="/"/>
};

export default AdminRoute;