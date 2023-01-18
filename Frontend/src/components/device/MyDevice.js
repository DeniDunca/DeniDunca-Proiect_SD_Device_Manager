
import classes from "./DevicesComponent.module.css";

const MyDevice = (props) => {

    return (
        <div>
            <li className={classes.li}>
                <div className={classes.div}>
                    <div>{props.name} </div>
                    <div>{props.description}</div>
                    <div>{props.address}</div>
                    <div>{props.maxConsumption}</div>
                </div>
            </li>
        </div>
    );
}
export default MyDevice;