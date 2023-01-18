import {useState, Fragment, useEffect} from "react";

import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';
import classes from "../device/DevicesComponent.module.css";

const AddDeviceForUser = (props) => {
    const [displayDevices, setDisplayDevices] = useState(false);
    const [devices, setDevices] = useState([]);

    function onSelect() {}

    const fetchDevices = async () => {
        const response = await fetch(`http://localhost:8080/api/device/getUnowned`,{
            headers: {'Authorization': `Bearer ${localStorage.getItem('token')}`}
        });

        if (!response.ok) {
            throw new Error("Something went wrong");
        }

        const responseData = await response.json();
        const loadedDevices = [];

        console.log(responseData)
        for(const key in responseData) {
            loadedDevices.push({
                id: responseData[key].id,
                name: responseData[key].name,
                description: responseData[key].description,
                address: responseData[key].address,
                maxConsumption: responseData[key].maxConsumption
            });
        }
        setDevices(loadedDevices);

    }


    useEffect(()=>{
        fetchDevices().catch((error) => {
        })
    },[]);


    const update = async () => {
        console.log("devices update");
        await fetchDevices();
    }

    let deviceList = []
    devices.map(
        device => deviceList.push(device.name)
    );
    const defaultOption = deviceList[0];

    const add = () => {
        console.log(defaultOption);

        let position = 0;
        for(const key in devices){
            console.log(devices[key].name)
            if(devices[key].name === defaultOption){
                    position = key;
                }
        }

        const updateUserForDevice = async () => {
            await fetch(`http://localhost:8080/api/device/update`, {
                method: 'PUT',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    id: devices[position].id,
                    name: devices[position].name,
                    description: devices[position].description,
                    address: devices[position].address,
                    maxConsumption: devices[position].maxConsumption,
                    user_id: props.id
                })
            })
        }
        updateUserForDevice().then(r => {
            update().then(r => props.updateList());
        });
    }

    return (
        <Fragment>
            <button className={classes.buttonAdd} onClick={() => {setDisplayDevices(!displayDevices)}}> Add Device </button>
            {displayDevices &&
            <Fragment>
                <Dropdown options={deviceList} onChange={onSelect} value={defaultOption}
                          placeholder="No devices without an user remaining :(" />
                <button className={classes.buttonAdd} onClick={add}>Confirm</button>
            </Fragment>
            }
        </Fragment>
    );
}

export default AddDeviceForUser;