import { db } from "../configs/connectDB.js";
import jwt from 'jsonwebtoken';
import moment from "moment";

export const getMessages = (req, res) => {
    console.log("req",req.query);
    const q =
        `SELECT m.*, c.description, u.name, u.profilePicture
        FROM messages AS m 
        JOIN conversations AS C ON (m.conversationId = c.id)
        JOIN users as u ON (u.id = m.userId)
        WHERE m.conversationId = ?
        ORDER BY m.createdAt
        `
        

    db.query(q,[req.query.conversationId],(err, data) => {
        if (err) {
            res.status(500).json(err);
        }
        return res.status(200).json(data)
    })
}


export const addMessage = (req, res) => {
    console.log("req.body", req.body);
    const token = req.cookies.accessToken;
    if (!token) {
        return res.status(401).json("Not logged in!!")
    }

    jwt.verify(token, "secretkey", (err, userInfo) => {
        if (err) {
            return res.status(400).json("Wrong password or username!")
        }

        const q =
        "INSERT INTO messages(`text`, `userId`, `conversationId`, `createdAt`) VALUES (?)";

        const values = [
            req.body.newMessage,
            userInfo.id,
            req.body.conversationId, 
            moment(Date.now()).format("YYYY-MM-DD HH:mm:ss")
          ];

        db.query(q, [values], (err, data) => {
            if (err) {
                res.status(500).json(err);
            }
            return res.status(200).json("Comment have been created")
        })
    });


}