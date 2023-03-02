import './conversations.scss'
import React from 'react'



const Conversations = ({ conversation, userId }) => {

    return (
        <div className="wrapperConversation">
            <div className="conversation">
                {
                    (conversation.userId1 === userId) ? <>
                        <img
                            className="conversationImg"
                            src={conversation.profilePicture2 ? "/upload/" + conversation.profilePicture2 : "/upload/user.png"}
                            alt=""
                        />
                        <span className="conversationName">{conversation.name2}</span>
                    </> :
                        <>
                            <img
                                className="conversationImg"
                                src={conversation.profilePicture ? "/upload/" + conversation.profilePicture : "/upload/user.png"}
                                alt=""
                            />
                            <span className="conversationName">{conversation.name}</span>
                        </>
                }

            </div>
        </div>
    )
}

export default Conversations