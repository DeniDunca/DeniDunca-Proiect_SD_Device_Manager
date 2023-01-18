import {useContext, useEffect, useState} from "react";
import AuthContext from "../../store/auth-context";
import classes from "./User.module.css";
import {NavLink} from "react-router-dom";
import Card from "../../utils/Card";
import MyDevice from "../../components/device/MyDevice";

const MyDevices = () => {

    const loginCtx = useContext(AuthContext);
    const [devices, setDevices] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [httpError, setHttpError] = useState();

    const fetchDevices = async () => {
        const response = await fetch(`http://localhost:8080/api/user/devices/${loginCtx.userId}`,{
            headers: {'Authorization': `Bearer ${localStorage.getItem('token')}`}
        });

        if (!response.ok) {
            throw new Error("Something went wrong");
        }

        const responseData = await response.json();
        const loadedDevices = [];

        console.log(responseData);
        for (const key in responseData) {
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

    useEffect(() => {
        fetchDevices().catch((error) => {
            setIsLoading(false);
            setHttpError(error.message);
        })
    }, [loginCtx.userId]);

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

    const deviceList = devices.map(device => <MyDevice key={device.id} id={device.id} name={device.name}
                                                       description={device.description} address={device.address}
                                                       maxConsumption={device.maxConsumption} update={update}/>);

    return (
        <section>
            <h1 className={classes.h1}>My devices</h1>
            <div className={classes.topnav}>
                <NavLink to={"/"}>Home</NavLink>
                <NavLink to={"/consumption"}>Consumption</NavLink>
            </div>
            <Card>
                <div className={classes.div}>
                    <p>Name</p>
                    <p>Description</p>
                    <p>Address</p>
                    <p>Maximum Energy Consumption</p>
                </div>

                <ul className={classes.ul}>
                    {deviceList}
                </ul>
            </Card>
        </section>
    )

}
export default MyDevices;