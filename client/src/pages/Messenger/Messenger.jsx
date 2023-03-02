import React, { useContext, useEffect } from 'react'
import ChatOnline from '../../components/chatOnline/ChatOnline'
import Conversations from '../../components/conversations/Conversations'
import Message from '../../components/message/Message'
import './messenger.scss'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiConfig } from "../../API/apiConfigs";
import { AuthContext } from '../../context/authContext'
import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import ChatBox from '../../components/chatBox/ChatBox'
import { switchClasses } from '@mui/material'



const Messenger = () => {
    // current chat
    const [currentChat, setCurrentChat] = useState({});
    const [currentChatId, setCurrentChatId] = useState(null);
    const userId = parseInt(useLocation().pathname.split('/')[2]);


    const { isLoading, error, data } = useQuery({
        queryKey: ['conversation'],
        queryFn: async () => await apiConfig.get("/v1/conversations?userId=" + userId)
            .then(res => {
                return res.data;
            })
            .catch(err => {
                console.log("error", err)
            })
    });


    console.log("currentChat", currentChat)

   

    return (
        <div className='messenger'>


            <div className="chatMenu">
                <div className="chatMenuWrapper">
                    <div className="chatMenuInput">
                        <input type="text" placeholder="Search" />
                    </div>
                    {error ? "Something went wrong!!" : isLoading ? "Loading" :
                        data.map(conversation => (
                            <div onClick={()=>setCurrentChat(conversation)} key={conversation.id}>
                                <Conversations userId={userId} conversation={conversation} />
                            </div>
                        ))
                    }
                </div>
            </div>
            <div className="chatBox">
            
                {currentChat.id ? <ChatBox userId={userId} currentChat={currentChat} /> :
                    <span className="noConversationText">
                        Open a conversation to start a chat.
                    </span>
                }
            </div>
            <div className="chatOnline">
                <div className="chatOnlineWrapper">
                    <ChatOnline />
                </div>
            </div>
        </div>
    )
}

export default Messenger