import React from 'react';
import {Message, MessageRequest} from "../../proto/output/ChatService_pb";
import {MessageServiceClient} from "../../proto/output/ChatServiceServiceClientPb";


const Chat = () => {
    const client = new MessageServiceClient('http://localhost:8081');
    const grpcCall = () => {

        let message = new Message();
        message.setUser('user1')
        message.setText('hello')

        const request = new MessageRequest();
        request.setMessage(message);


        client.message(request, {}, (err, response) => {
            console.log({err, response});
        });

    }

    // const subscribe = () => {
    //     const chatCall = client.chat();
    //     chatCall.on('data', (message) => {
    //         setMessages((prevMessages) => [...prevMessages, message]);
    //     });
    //     chatCall.on('error', (err) => {
    //         console.error('Error receiving message', err);
    //     });
    // }

    return (
        <div>
            <button onClick={grpcCall}>Start Chat</button>
        </div>
    );
}
export default Chat;
