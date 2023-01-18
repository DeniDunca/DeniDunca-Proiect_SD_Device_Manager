
const ChatTable = (props) => {

    const expChat = () => {
      props.expandChat(props.user);
    }

    return(
       <div onClick={expChat}>
           <p>User{props.user}</p>
       </div>
    );
}
export default ChatTable;