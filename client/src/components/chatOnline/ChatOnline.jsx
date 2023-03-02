import React from 'react'
import './chatOnline.scss'

const ChatOnline = () => {
    return (
        <div className="chatOnline">
            <div className="chatOnlineFriend">
                <div className="chatOnlineImgContainer">
                    <img src="/upload/user.png" alt="" className="chatOnlineImg" />
                    <div className="chatOnlineBadge"></div>
                </div>
                <span className="chatOnlineName">
                    Loc Nguyen
                </span>
            </div>
        </div>
    )
}

export default ChatOnline