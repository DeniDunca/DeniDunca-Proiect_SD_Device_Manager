import {Navigate, useNavigate} from "react-router-dom";
import {useContext, useRef, useState, Fragment} from "react";
import AuthContext from "../../store/auth-context";
import classes from './Login.module.css';

const isLongerThanFourDigits = (value) => value.trim().length > 4;

const Login = () => {
    const navigate = useNavigate();
    const loginCtx = useContext(AuthContext);

    const [formInputsValidity, setFormInputsValidity] = useState({
        name: true,
        password: true
    });

    const nameInputRef = useRef();
    const passwordInputRef = useRef();

    const confirmHandler = (event) => {
        event.preventDefault();

        const enteredName = nameInputRef.current.value;
        const enteredPassword = passwordInputRef.current.value;

        const enteredNameIsValid = isLongerThanFourDigits(enteredName);
        const enteredPasswordIsValid = isLongerThanFourDigits(enteredPassword);

        setFormInputsValidity({
            name: enteredNameIsValid,
            password: enteredPasswordIsValid
        });

        let formIsValid = enteredNameIsValid && enteredPasswordIsValid;

        if(!formIsValid){
            return;
        }

        loginCtx.onLogin(enteredName,enteredPassword);

    };

    const passwordControlClasses = `${classes.control} ${formInputsValidity.name ? '' : classes.invalid}`;
    const nameControlClasses = `${classes.control} ${formInputsValidity.password ? '' : classes.invalid}`;

    const setErrorFalse = () => {
        loginCtx.setLogInError();
    }

    const redirectRegister = () => {
        navigate('/register');
    }

    return (
        <div>
            <Fragment>
                {loginCtx.role === 1 && <Navigate to="/admin"/>}
                {loginCtx.role === 2 && <Navigate to="/"/>}
                <form className={classes.form} onSubmit={confirmHandler}>
                    <div className={passwordControlClasses}>
                        <label htmlFor='name'>Name</label>
                        <input type='text' id='name' ref={nameInputRef} onClick={setErrorFalse}/>
                        {!formInputsValidity.name && <p>Please enter a valid name!</p>}
                    </div>
                    <div className={nameControlClasses}>
                        <label htmlFor='password'>Password</label>
                        <input type='password' id='password' ref={passwordInputRef} onClick={setErrorFalse}/>
                        {!formInputsValidity.password && <p>Please enter a valid password!</p>}
                    </div>
                    {loginCtx.logInError && <p>Invalid log in Data. Please try again!</p>}
                    <div className={classes.actions}>
                        <button type='button' onClick={redirectRegister}>Create Account</button>
                        <button className={classes.submit}>Confirm</button>
                    </div>
                </form>
            </Fragment>
        </div>
    );
}
export default Login;