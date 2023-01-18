import Card from "../../utils/Card";
import classes from "../device/DevicesComponent.module.css";

const Device = (props) => {

    function deleteHandler() {
        const fetchDevices = async () => {
            await fetch(`http://localhost:8080/api/device/update`, {
                method: 'PUT',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    id: props.id,
                    name: props.name,
                    description: props.description,
                    address: props.address,
                    maxConsumption: props.maxConsumption,
                    user_id: null
                })
            })
        }
        fetchDevices().then(r => props.update());
    }

    return (
        <Card>
            <li className={classes.li}>
                 <div className={classes.li}>
                    <div>Name:{props.name} </div>
                    <div>Description:{props.description}</div>
                    <div>Address:{props.address}</div>
                    <div>Maximum Energy Consumption:{props.maxConsumption}</div>
                </div>
                <div className={classes.actions}>
                    <button className={classes.buttonDelete} onClick={deleteHandler}>Delete Device From User</button>
                </div>

            </li>
        </Card>
    );
}
export default Device;