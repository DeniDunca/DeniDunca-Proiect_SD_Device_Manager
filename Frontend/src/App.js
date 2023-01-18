import {Route, Routes} from "react-router-dom";
import PrivateRoute from "./PrivateRoute";
import Login from "./pages/login_page/Login";
import User from "./pages/user_page/User";
import Admin from "./pages/admin_page/Admin";
import Register from "./pages/login_page/Register";
import ManageUsers from "./pages/admin_page/ManageUsers";
import {useContext, useEffect, useState} from "react";
import AuthContext from "./store/auth-context";
import UserRoute from "./UserRoute";
import AdminRoute from "./AdminRoute";
import ManageDevices from "./pages/admin_page/ManageDevices";
import MyDevices from "./pages/user_page/MyDevices";
import Consumption from "./pages/user_page/Consumption";
import ChatAdmin from "./pages/admin_page/ChatAdmin";
import ChatUser from "./pages/user_page/ChatUser";

function App() {
    const loginCtx = useContext(AuthContext);
    const [loaded,setLoaded] = useState(false);

    useEffect(() => {
        loginCtx.setCookieData();
        setLoaded(true);
    },[])

    if(!loaded)
        return "Loading...";

  return (

      <Routes>
          <Route path="/" element={<PrivateRoute/>}>
              <Route path="/" element={<UserRoute/>}>
                  <Route exact path="/" element={<User/>}/>
                  <Route exact path="/seeDevices" element={<MyDevices/>}/>
                  <Route exact path="/consumption" element={<Consumption/>}/>
                  <Route exact path="/userChat" element={<ChatUser/>}/>
              </Route>
              <Route path="/" element={<AdminRoute/>}>
                  <Route exact path="/admin" element={<Admin/>}/>
                  <Route exact path="/manageUsers" element={<ManageUsers/>}/>
                  <Route exact path="/manageDevices" element={<ManageDevices/>}/>
                  <Route exact path="/adminChat" element={<ChatAdmin/>}/>
              </Route>
          </Route>
          <Route exact path="/login" element={<Login/>}/>
          <Route exact path="/register" element={<Register/>}/>
      </Routes>
  );
}

export default App;
