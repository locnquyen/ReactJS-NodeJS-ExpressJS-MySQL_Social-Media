import { db } from "../configs/connectDB.js";
import jwt from 'jsonwebtoken';
import moment from "moment";

export const getConversations = (req, res) => {
    const userId = req.query.userId;

    const token = req.cookies.accessToken;
    if (!token) {
        return res.status(401).json("Not logged in!!")
    }

    jwt.verify(token, "secretkey", (err, userInfo) => {
        if (err) {
            return res.status(400).json("Wrong password or username!")
        }
      

        const q =
            `SELECT c.*, u.id AS userId1, u.name, u.profilePicture,
            users.name as name2, users.profilePicture as profilePicture2
            FROM conversations AS c 
            JOIN users AS u ON (u.id = c.userId)
            JOIN users ON (users.id = c.userId2)
            WHERE c.userId = ? OR c.userId2 = ?`



        db.query(q, [userId, userId], (err, data) => {
            if (err) {
                res.status(500).json(err);
            }
            return res.status(200).json(data);
        })
    });
}


export const addConversation = (req, res) => {

}