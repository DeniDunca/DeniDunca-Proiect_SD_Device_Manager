import classes from './Message.module.css'
import {useEffect} from "react";

const Message = (props) => {
   let myMessage = false;

   if(props.user === props.from){
       myMessage = true;
   }

  const messageControlClasses = `${classes.control} ${myMessage? classes.mine: ''}`;

  return(
      <div className={messageControlClasses}>
          {props.message}
      </div>
  );
}
export default Message;