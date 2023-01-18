import React, {useRef, useState} from "react";
import classes from "./Login.module.css";
import {useNavigate} from "react-router-dom";

const isLongerThanFourDigits = (value) => value.trim().length > 4;

const Register = () => {
    const navigate = useNavigate();
    const nameInputRef = useRef();
    const passwordInputRef = useRef();
    const confirmPasswordInputRef = useRef();

    const [formInputsValidity, setFormInputsValidity] = useState({
        name: true,
        password: true
    });

    const register = async(nameVal, passVal) => {
        const response = await fetch('http://localhost:8080/api/user/create', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: nameVal,
                password: passVal,
                role: 2
            })
        });
        if (!response.ok) {
            throw new Error('Something went wrong!');
        }
        return response;
    }

    const confirmHandler = (event) => {
        event.preventDefault();

        const enteredName = nameInputRef.current.value;
        const enteredPassword = passwordInputRef.current.value;
        const enteredConfirmPassword = confirmPasswordInputRef.current.value;

        const enteredNameIsValid = isLongerThanFourDigits(enteredName);
        const enteredPasswordIsValid = isLongerThanFourDigits(enteredPassword)
            && enteredConfirmPassword === enteredPassword;

        setFormInputsValidity({
            name: enteredNameIsValid,
            password: enteredPasswordIsValid,
        });

        const formIsValid = enteredNameIsValid && enteredPasswordIsValid;

        if (!formIsValid) {
            return;
        }

        register(enteredName, enteredPassword).then(r => {
            navigate('/login');
            alert("Account created")
        });
    }

    const setErrorFalse = () => {
    }
    const goBack = () => {
        navigate('/login');

    }

    const passwordControlClasses = `${classes.control} ${formInputsValidity.name ? '' : classes.invalid}`;
    const nameControlClasses = `${classes.control} ${formInputsValidity.password ? '' : classes.invalid}`;


    return (
        <form className={classes.form} onSubmit={confirmHandler}>
            <div className={nameControlClasses}>
                <label htmlFor='name'>Name</label>
                <input type='text' id='name' ref={nameInputRef} onClick={setErrorFalse}/>
                {!formInputsValidity.name && <p>Please enter a valid name!</p>}
            </div>
            <div className={passwordControlClasses}>
                <label htmlFor='password'>Password</label>
                <input type='password' id='password' ref={passwordInputRef} onClick={setErrorFalse}/>
                {!formInputsValidity.password && <p>Please enter a valid password!</p>}
            </div>
            <div className={passwordControlClasses}>
                <label htmlFor='confirmPassword'>Confirm Password</label>
                <input type='password' id='confirmPassword' ref={confirmPasswordInputRef} onClick={setErrorFalse}/>
                {!formInputsValidity.password && <p>Please enter a valid password!</p>}
            </div>

            <div className={classes.actions}>
                <button className={classes.submit}>Confirm</button>
                <button className={classes.submit} onClick={goBack}>Back</button>
            </div>
        </form>
    );
}

export default Register;