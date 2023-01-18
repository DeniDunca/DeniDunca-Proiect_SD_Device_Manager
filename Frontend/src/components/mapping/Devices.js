import classes from "../../pages/admin_page/Admin.module.css";
import Card from "../../utils/Card";
import {useEffect, useState} from "react";
import Device from "./Device";
import AddDeviceForUser from "./AddDeviceForUser";


const Devices = (props) => {
    const [devices, setDevices] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [httpError, setHttpError] = useState();

    const fetchDevices = async () => {
        const response = await fetch(`http://localhost:8080/api/user/devices/${props.id}`,{
            headers: {'Authorization': `Bearer ${localStorage.getItem('token')}`}
        });

        if (!response.ok) {
            throw new Error("Something went wrong");
        }

        const responseData = await response.json();
        const loadedDevices = [];

        console.log(responseData);
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
        setIsLoading(false);
    }

    useEffect(()=>{
        fetchDevices().catch((error) => {
            setIsLoading(false);
            setHttpError(error.message);
        })
    },[]);

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
        console.log("devices update");
        await fetchDevices();
    }

    const deviceList = devices.map(device => <Device key={device.id} id={device.id} name={device.name} description={device.description} address={device.address} maxConsumption={device.maxConsumption} update={update}/>);

    return(
        <Card>
            <ul className={classes.ul}>
                {deviceList}
            </ul>
            <AddDeviceForUser id={props.id} updateList={update}/>
        </Card>
    );
}

export default Devices;