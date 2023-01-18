import classes from "../admin_page/Admin.module.css";
import {NavLink} from "react-router-dom";
import Card from "../../utils/Card";
import React from "react";
import MessagesUser from "../../components/chat/MessagesUser";

const ChatUser = () => {

  return (
      <section>
          <h1 className={classes.h1}>Ask the admin</h1>
          <div className={classes.topnav}>
              <NavLink to={'/'}>Home</NavLink>
          </div>
          <div className={classes.inbox}>
              <Card>
                  <h1>Chat with Admin </h1>
                  <MessagesUser/>
              </Card>
          </div>
      </section>
  );
}
export default ChatUser;