import classes from "./Admin.module.css";
import {NavLink} from "react-router-dom";
import Card from "../../utils/Card";
import ChatTable from "../../components/chat/ChatTable";
import {useState, useEffect} from "react";
import Messages from "../../components/chat/Messages";
import * as SockJS from "sockjs-client";
import {Stomp} from "@stomp/stompjs";


const ChatAdmin = () => {

    const [isChatOpen, setChatOpen] = useState(false);
    const [userChat, setUserChat] = useState('');

    const [inboxMessages,setInboxMessages] = useState([]);
    const [userList, setUserList] = useState([]);

    useEffect(() => {
        console.log("In Connect");
        const URL = "http://localhost:8080/socket";
        const websocket = new SockJS(URL);
        const stompClient = Stomp.over(websocket);
        stompClient.connect({}, frame => {
            console.log("Conectat la " + frame);
            stompClient.subscribe(`/notification/socket/api/chat/1`, notification => {
                console.log("message received from admin!");
                console.log(notification.body);
                //setMessage([...message,notification.body]);
                fetchMessages().catch(error => console.log(error));
            })
        })
    },[])

    const messageRead = async () => {
        console.log("admin, messageRead called");
        await fetch(`http://localhost:8080/api/user/messageRead`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({
                from: 1,
                to: userChat,
                text: "message Read"
            })
        })
    }

    const fetchMessages = async () => {
        const response = await fetch(`http://localhost:8080/api/user/getMessages`,{
            headers: {'Authorization': `Bearer ${localStorage.getItem('token')}`}
        });

        if (!response.ok) {
            throw new Error("Something went wrong");
        }

        const responseData = await response.json();
        const loadedUsers = [];

        console.log(responseData)
        for(const key in responseData) {
            if(responseData[key].from === 1)
                continue;
            loadedUsers.push({
                from: responseData[key].from,
                to: responseData[key].to,
                text: responseData[key].text,
            });
        }
        setInboxMessages(loadedUsers);
    }

    useEffect(() => {
        fetchMessages().catch((error) => {
            console.log(error);
        });
    },[])

    useEffect(() => {
        let newList = [];
        for(const id in inboxMessages){
            if(!newList.includes(inboxMessages[id].from)){
                newList.push(inboxMessages[id].from)
            }
        }
        console.log(newList);
        setUserList(newList);
    },[inboxMessages]);

    const expandChat = (user) =>{
        setChatOpen(true);
        setUserChat(user);
    }

    const messagesList = userList.map(msg => <ChatTable key={msg} user={msg} expandChat={expandChat}/>);
    return(
        <section>
            <h1 className={classes.h1}>Chat</h1>
            <div className={classes.topnav}>
                <NavLink to={"/admin"}>Home</NavLink>
            </div>
            <div className={classes.inbox}>
            <Card>
                <div>
                    {messagesList}
                </div>
            </Card>
                {!isChatOpen && <Card/>}
                {isChatOpen && <Card>
                    <h1>Chatting with User{userChat} </h1>
                    <Messages messageRead={messageRead} inboxMessages={inboxMessages} user={userChat}/>
                    </Card>}
            </div>
        </section>
    );
}
export default ChatAdmin;