import classes from "./DevicesComponent.module.css";

const {useState, useRef} = require("react");


const AddUser = (props) => {
    const [isAdded, setIsAdded] = useState(false);
    const name = useRef();
    const description = useRef();
    const address = useRef();
    const maxConsumption = useRef();

    function addHandler() {
        setIsAdded(true);
    }

    function submitHandler(event) {
        event.preventDefault();

        const fetchDevices = async () => {
            await fetch(`http://localhost:8080/api/device/create`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    name: name.current.value,
                    description: description.current.value,
                    address: address.current.value,
                    maxConsumption: maxConsumption.current.value,
                })
            })
        }
        fetchDevices().then(r => props.update());
        setIsAdded(false);
    }

    function backHandler() {
        setIsAdded(false);
    }

    return (
        <div className={classes.actions}>
            <button className={classes.buttonAdd} onClick={addHandler}>Add new Device</button>
            <div className={classes.div}>
                {isAdded && <form onSubmit={submitHandler}>
                    <h3>Enter device details</h3>
                    <input placeholder={"Name"} ref={name}/>
                    <input placeholder={"Description"} ref={description}/>
                    <input placeholder={"Address"} ref={address}/>
                    <input placeholder={"Maximum Energy Consumption"} ref={maxConsumption}/>
                    <button className={classes.button} onClick={backHandler}>Back</button>
                    <button className={classes.buttonAdd}>Confirm</button>
                </form>
                }
            </div>
        </div>
    )

}
export default AddUser;