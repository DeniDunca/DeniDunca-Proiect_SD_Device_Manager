import Card from "../../utils/Card";
import Message from "./Message";
import {useContext, useEffect, useRef, useState} from "react";
import AuthContext from "../../store/auth-context";
import * as SockJS from "sockjs-client";
import {Stomp} from "@stomp/stompjs";


const MessagesUser = () => {
    const loginCtx = useContext(AuthContext);
    const messageUser = useRef('');
    const [message, setMessage] = useState([]);
    const [messageSeen, setMessageSeen] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);

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
                from: loginCtx.userId,
                to: 1, // admin
                text: msg
            })
        })
    }

    useEffect(() => {
        const URL = "http://localhost:8080/socket";
        const websocket = new SockJS(URL);
        const stompClient = Stomp.over(websocket);
        stompClient.connect({}, frame => {
            //console.log("Conectat la " + frame);
            stompClient.subscribe(`/notification/socket/api/typing/${loginCtx.userId}`, notification => {
                if(notification.body === "typing"){
                    setIsTyping(true);
                } else{
                    setIsTyping(false);
                }
            })
        })

        return () => {
            websocket.close();
        };
    },[])

    useEffect(() => {
        const URL = "http://localhost:8080/socket";
        const websocket = new SockJS(URL);
        const stompClient = Stomp.over(websocket);
        stompClient.connect({}, frame => {
            //console.log("Conectat la " + frame);
            stompClient.subscribe(`/notification/socket/api/seen/${loginCtx.userId}`, notification => {
                setMessageSeen(true);
            })
        })

        return () => {
            websocket.close();
        };
    },[])


    useEffect(() => {
        const URL = "http://localhost:8080/socket";
        const websocket = new SockJS(URL);
        const stompClient = Stomp.over(websocket);
        stompClient.connect({}, frame => {
            //console.log("Conectat la " + frame);
            stompClient.subscribe(`/notification/socket/api/chat/${loginCtx.userId}`, notification => {
                console.log(notification.body);
                //setMessage([...message,notification.body]);
                fetchMessages().catch(error => console.log(error));
                messageRead().catch(error => console.log(error));
                setMessageSeen(false);
            })
        })

        return () => {
            websocket.close();
        };
    },[])

    const messageRead = async () => {
        await fetch(`http://localhost:8080/api/user/messageRead`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({
                from: loginCtx.userId,
                to: 1, // admin
                text: "message Read"
            })
        })
    }

    const fetchMessages = async () => {
        const response = await fetch(`http://localhost:8080/api/user/getMessages/${loginCtx.userId}`,{
            headers : {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

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
        fetchMessages().catch(error => console.log(error));
        messageRead().catch(error => console.log(error));
    },[])

    const send = async (receivedMessage) => {
        await fetch(`http://localhost:8080/api/user/message`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({
                from: loginCtx.userId,
                to: 1, // admin
                text: receivedMessage
            })
        })
    }

    const sendMessage = (event) => {
        event.preventDefault();
        setMessageSeen(false);
        setMessage([...message,{
            from: loginCtx.userId,
            to: 1,
            text:messageUser.current.value}]);

        send(messageUser.current.value).then(r => console.log("Message sent!"));
        messageUser.current.value = '';
        setInputValue('');
    }

    const messages = message.map(msg => <Message key={Math.random()}
                                                 user={loginCtx.userId}
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
                    <input type='text' placeholder={"Enter message"} ref={messageUser}
                        value={inputValue} onChange={e => setInputValue(e.target.value)}/>
                    <button>Send</button>
                    {messageSeen && <p>Seen</p>}
                </form>
            </div>
        </Card>
    );
}
export default MessagesUser;