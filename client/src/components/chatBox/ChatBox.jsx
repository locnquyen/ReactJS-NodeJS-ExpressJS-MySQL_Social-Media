import React, { useEffect, useState } from 'react'
import './chatBox.scss'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiConfig } from "../../API/apiConfigs";
import Message from '../message/Message';
import { useRef } from 'react';


const ChatBox = ({ currentChat,userId  }) => {
    console.log("currentChat", currentChat)

    const [newMessage, setNewMessage] = useState("");
    const [conversationId, setConversationId] = useState(currentChat.id)

    const scrollRef = useRef()

    useEffect(() => {
        setConversationId(currentChat.id)
    }, [currentChat.id])

    //query message table
    const { isLoading, error, data: messages } = useQuery({
        queryKey: ['message'],
        queryFn: async () =>
            await apiConfig.get("/v1/messages?conversationId=" + conversationId)
                .then(res => {
                    //setMessages(res.data)
                    return res.data;
                })
                .catch(err => {
                    console.log("error", err)
                })
    });

    console.log("messages", messages)
    console.log("chat box re-render")

      // Access the client
      const queryClient = useQueryClient()
      //mutation
      const mutation = useMutation({
          mutationFn: newMessage => apiConfig.post('/v1/message/', newMessage),
          onSuccess: () => {
              // Invalidate and refetch
              queryClient.invalidateQueries({ queryKey: ['message'] })
          },
      })
  


    const handleSubmit = (e) => {
        e.preventDefault();
        mutation.mutate({newMessage, userId ,conversationId : currentChat.id });
        setNewMessage("")
    }

    useEffect(()=>{
        scrollRef?.current?.scrollIntoView({behavior: 'smooth'})
    }, [messages])

    return (
        <div className="chatBoxWrapper">
            <div className="chatBoxTop">
                {
                    error ? "Something went wrong!!" : isLoading ? "Loading" : currentChat ?
                        messages.map(message => {
                            return (
                                <div ref={scrollRef} key={message.id}>
                                    <Message message={message} />
                                </div>
                            )
                        }) : <span>
                            Open a conversation to start a chat.
                        </span>
                }
            </div>
            <div className="chatBoxBottom">
                <textarea name=""
                    className="chatMessageInput"
                    placeholder='Write something...'
                    onChange={(e) => setNewMessage(e.target.value)}
                    value={newMessage}
                ></textarea>
                <button
                    onClick={handleSubmit}
                    className="chatSubmitButton" >
                    Send
                </button>
            </div>
        </div>
    )
}

export default ChatBox