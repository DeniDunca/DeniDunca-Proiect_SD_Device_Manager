import classes from "./DevicesComponent.module.css";

const MyConsumption = (props) => {

    return (
        <div>
            <li className={classes.li}>
                <div className={classes.div}>
                    <div>{props.date} </div>
                    <div>{props.hour}</div>
                    <div>{props.energyConsumption}</div>
                    <div>{props.deviceId}</div>
                </div>
            </li>
        </div>
    );
}
export default MyConsumption;