import {useRef, useState} from "react";
import classes from "./DevicesComponent.module.css";

const DevicesTable = (props) => {
    const [isModify, setIsModify] = useState(false);
    const name = useRef(props.name);
    const description = useRef(props.description);
    const address = useRef(props.address);
    const maxConsumption = useRef(props.maxConsumption);

    function modifyHandler() {
        setIsModify(true);
    }

    function backHandler() {
        setIsModify(false);
    }

    function confirmHandler() {
        const fetchDevices = async () => {
            await fetch('http://localhost:8080/api/device/update', {
                method: 'PUT',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    id: props.id,
                    name: name.current.value,
                    description: description.current.value,
                    address: address.current.value,
                    maxConsumption: maxConsumption.current.value,
                })
            })
        }
        fetchDevices().then(r => props.update());
        setIsModify(false);
    }

    function deleteHandler() {
        const fetchDevices = async () => {
            await fetch(`http://localhost:8080/api/device/delete/${props.id}`, {
                method: 'DELETE',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            })
        }
        fetchDevices().then(r => props.update());
    }

    return (
        <div>
            <li className={classes.li}>
                {isModify &&
                <div className={classes.actions}>
                    <input defaultValue={props.name} ref={name}/>
                    <input defaultValue={props.description} ref={description}/>
                    <input defaultValue={props.address} ref={address}/>
                    <input defaultValue={props.maxConsumption} ref={maxConsumption}/>
                </div>}
                {!isModify && <div className={classes.div}>
                    <div>{props.name} </div>
                    <div>{props.description}</div>
                    <div>{props.address}</div>
                    <div>{props.maxConsumption}</div>
                </div>}
                {isModify &&
                <div className={classes.actions}>
                    <button className={classes.buttonAdd} onClick={confirmHandler}>Confirm</button>
                    <button className={classes.button} onClick={backHandler}>Back</button>
                </div>
                }
                {!isModify &&
                <div className={classes.actions}>
                    <button className={classes.button} onClick={modifyHandler}>Modify Device</button>
                    <button className={classes.buttonDelete} onClick={deleteHandler}>Delete Device</button>
                </div>
                }
            </li>
        </div>
    );
}
export default DevicesTable;