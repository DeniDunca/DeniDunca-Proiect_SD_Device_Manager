import {useRef, useState} from "react";
import classes from "./UsersComponent.module.css";
import Devices from "../mapping/Devices";

const UserTable = (props) => {
    const [isModify, setIsModify] = useState(false);
    const name = useRef(props.name);
    const password = useRef(props.password);
    const role = useRef(props.role);

    const [devicesVisible, setDevicesVisible] = useState(false);

    function modifyHandler() {
        setIsModify(true);
    }

    function backHandler() {
        setIsModify(false);
    }

    function confirmHandler() {
        const fetchUsers = async () => {
            await fetch('http://localhost:8080/api/user/update', {
                method: 'PUT',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    id: props.id,
                    name: name.current.value,
                    password: password.current.value,
                    role: role.current.value
                })
            })
        }
        fetchUsers().then(r => props.update());
        setIsModify(false);
    }

    function deleteHandler() {
        const fetchUsers = async () => {
            await fetch(`http://localhost:8080/api/user/delete/${props.id}`, {
                method: 'DELETE',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            })
        }
        fetchUsers().then(r => props.update());
    }

    const seeDevicesForUser = () => {
        setDevicesVisible(!devicesVisible);
    }

    return (
        <div>
            <li className={classes.li}>
                {isModify &&
                <div className={classes.actions}>
                    <input defaultValue={props.name} ref={name}/>
                    <input defaultValue={props.password} ref={password}/>
                    <input defaultValue={props.role} ref={role}/>
                </div>}
                {!isModify && <div className={classes.div}>
                    <div>{props.name} </div>
                    <div>{props.password}</div>
                    <div>{props.role}</div>
                </div>}
                {isModify &&
                <div className={classes.actions}>
                    <button className={classes.buttonAdd} onClick={confirmHandler}>Confirm</button>
                    <button className={classes.button} onClick={backHandler}>Back</button>
                </div>
                }
                {!isModify &&
                <div className={classes.actions}>
                    <button className={classes.button} onClick={modifyHandler}>Modify User</button>
                    <button className={classes.buttonDelete} onClick={deleteHandler}>Delete User</button>
                    <button className={classes.buttonAdd} onClick={seeDevicesForUser}>Devices</button>
                </div>
                }
            </li>
            {devicesVisible && <Devices id={props.id}/>}
        </div>
    );


}
export default UserTable;