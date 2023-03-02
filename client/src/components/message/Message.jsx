import React from 'react'
import './message.scss'
import moment from "moment";
import { useContext } from 'react';
import { AuthContext } from '../../context/authContext';


const Message = ({ message}) => {

    const { currentUser } = useContext(AuthContext);
    console.log("message",message)

    return (
        <div className="wrapperMessage">
            <div className={currentUser.id === message.userId ? "message own" : "message"} >
                <div className="messageInfo">
                    <div className="messageImg">
                        <img
                            className=""
                            src={message.profilePicture ? "/upload/" + message.profilePicture : "/upload/user.png"}
                            alt=""
                        />
                    </div>
                    <div className="message__time">
                        <p className={currentUser.id === message.userId ? "ownMessageText" :"messageText"}>{message.text}</p>
                        <div className="mDateTime">{moment(message.createdAt).fromNow()}</div>
                    </div>
                </div>

            </div>
        </div>
    );
}

export default Message