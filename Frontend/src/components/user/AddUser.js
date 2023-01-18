import classes from "./UsersComponent.module.css";
const {useState, useRef} = require("react");


const AddUser = (props) => {
    const [isAdded, setIsAdded] = useState(false);
    const name = useRef();
    const password = useRef();
    const role = useRef();

    function addHandler() {
        setIsAdded(true);
    }

    function submitHandler(event) {
        event.preventDefault();

        const fetchUsers = async () => {
            await fetch(`http://localhost:8080/api/user/create`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    name: name.current.value,
                    password: password.current.value,
                    role: role.current.value,
                })
            })
        }
        fetchUsers().then(r => props.update());
        setIsAdded(false);
    }

    function backHandler() {
        setIsAdded(false);
    }

    return (
        <div className={classes.actions}>
            <button className={classes.buttonAdd} onClick={addHandler}>Add new user</button>
            <div className={classes.div}>
                {isAdded && <form onSubmit={submitHandler}>
                    <h3>Enter user details</h3>
                    <input placeholder={"Name"} ref={name}/>
                    <input placeholder={"Password"} ref={password}/>
                    <input placeholder={"Role"} ref={role}/>
                    <button className={classes.button} onClick={backHandler}>Back</button>
                    <button className={classes.buttonAdd}>Confirm</button>
                </form>}
            </div>
        </div>
    )

}
export default AddUser;