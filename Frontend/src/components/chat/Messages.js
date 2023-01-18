import Card from "../../utils/Card";
import Message from "./Message";
import {useEffect, useRef, useState} from "react";
import * as SockJS from "sockjs-client";
import {Stomp} from "@stomp/stompjs";


const Messages = (props) => {
    const messageAdmin = useRef();
    const [message, setMessage] = useState([]);
    const [messageSeen, setMessageSeen] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);

    const fetchMessages = async () => {
        const response = await fetch(`http://localhost:8080/api/user/getMessagesFromUser/${props.user}`,{
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }});

        if (!response.ok) {
            throw new Error("Something went wrong");
        }

        const responseData = await response.json();
        const loadedUsers = [];

        console.log(responseData)
        for(const key in responseData) {
            loadedUsers.push({
                from: responseData[key].from,
                to: responseData[key].to,
                text: responseData[key].text,
            });
        }
        setMessage(loadedUsers);
    }

    useEffect(() => {
        if(inputValue.length >= 1){
            typing("typing").catch(error => console.log(error));
        } else{
            typing("stopped typing").catch(error => console.log(error));
        }
    },[inputValue])

    const typing = async (msg) => {
        await fetch(`http://localhost:8080/api/user/typing`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({
                from: 1,
                to: props.user, // admin
                text: msg
            })
        })
    }

    useEffect(() => {
        const URL = "http://localhost:8080/socket";
        const websocket = new SockJS(URL);
        const stompClient = Stomp.over(websocket);
        stompClient.connect({}, frame => {
            stompClient.subscribe(`/notification/socket/api/seen/1`, notification => {
                setMessageSeen(true);
            })
        })
    },[])

    useEffect(() => {
        const URL = "http://localhost:8080/socket";
        const websocket = new SockJS(URL);
        const stompClient = Stomp.over(websocket);
        stompClient.connect({}, frame => {
            stompClient.subscribe(`/notification/socket/api/typing/1`, notification => {
                if(notification.body === "typing"){
                    setIsTyping(true);
                } else{
                    setIsTyping(false);
                }
            })
        })
    },[])

    useEffect(() => {
        fetchMessages().catch(error => console.log(error));
        props.messageRead();
        setMessageSeen(false);
    },[props.user, props.inboxMessages])

    const send = async (receivedMessage) => {
        await fetch(`http://localhost:8080/api/user/message`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({
                from: 1,
                to: props.user, // admin
                text: receivedMessage
            })
        })
    }

    const sendMessage = (event) => {
        event.preventDefault();
        setMessageSeen(false);
        setMessage([...message,{
            from: 1,
            to: props.user, // admin
            text: messageAdmin.current.value
        }]);
        console.log(messages);

        send(messageAdmin.current.value).then(r => console.log("Message sent!"));
        messageAdmin.current.value = '';
        setInputValue('');
    }
    const messages = message.map(msg => <Message key={Math.random()}
                                                 user={1}
                                                 from={msg.from}
                                                 to={msg.to}
                                                 message={msg.text}/>);

    return(
        <Card>
            <div>
                {messages}
            </div>
            <div>
                <form onSubmit={sendMessage}>
                    {isTyping && <p>Typing...</p>}
                    <input type='text' placeholder={"Enter message"} ref={messageAdmin}
                           value={inputValue} onChange={e => setInputValue(e.target.value)}/>
                    <button>Send</button>
                    {messageSeen && <p>Seen</p>}
                </form>
            </div>
        </Card>
    );
}
export default Messages;