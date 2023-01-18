import {useContext, useEffect, useState} from "react";
import AuthContext from "../../store/auth-context";
import {NavLink} from "react-router-dom";
import classes from './Admin.module.css';
import Card from "../../utils/Card";
import UserTable from "../../components/user/UserTable";
import AddUser from "../../components/user/AddUser";

const ManageUsers = () => {

    const loginCtx = useContext(AuthContext);
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [httpError, setHttpError] = useState();

    const fetchUsers = async () => {
        const response = await fetch(`http://localhost:8080/api/user/getAll`, {headers:{
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }});

        if (!response.ok) {
            throw new Error("Something went wrong");
        }

        const responseData = await response.json();
        const loadedUsers = [];

        console.log(responseData)
        for(const key in responseData) {
            loadedUsers.push({
                id: responseData[key].id,
                name: responseData[key].name,
                password: responseData[key].password,
                role: responseData[key].role
            });
        }
        setUsers(loadedUsers);
        setIsLoading(false);
    }

    useEffect(()=>{
        fetchUsers().catch((error) => {
            setIsLoading(false);
            setHttpError(error.message);
        })
    },[loginCtx.userId]);

    if (isLoading) {
        return <section>
            <p>Loading...</p>
        </section>
    }

    if (httpError) {
        return <section>
            <p>{httpError}</p>
        </section>
    }

    const update = async () => {
        console.log("users update");
        await fetchUsers();
    }
    const userList = users.map(user => <UserTable key={user.id} id={user.id} name={user.name} password={user.password} role={user.role} update={update}/>);

    return (
        <section>
            <h1 className={classes.h1}>Users Management</h1>
            <div className={classes.topnav}>
                <NavLink to={"/admin"}>Home</NavLink>
                <NavLink to={"/manageDevices"}>Manage Devices</NavLink>
            </div>
            <Card>
                <div className={classes.div}>
                    <p>Name</p>
                    <p>Password</p>
                    <p>Role</p>
                </div>
                <ul className={classes.ul}>
                    {userList}
                </ul>
                {<AddUser className={classes.add} update={update}/>}
            </Card>

        </section>
    )

}
export default ManageUsers;