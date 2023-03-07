import { db } from "../configs/connectDB.js";
import jwt from 'jsonwebtoken';

export const getUser = (req, res) => {
    //TODO
    const userId = req.params.userId;
    const q = "SELECT * FROM users WHERE id=?"

    db.query(q, [userId], (err, data) => {
        if (err) {
            res.status(500).json(err)
        }

        const { password, ...info } = data[0];
        return res.json(info);
    })
}

export const updateUser = (req, res) => {
    const token = req.cookies.accessToken;
    if (!token) {
        return res.status(401).json("Not authenticated!")
    }

    jwt.verify(token, "secretkey", (err, userInfo) => {
        if (err) {
            return res.status(400).json("Token is not valid!")
        }
        const q =
            "UPDATE users SET `name`=?,`city`=?,`website`=?,`profilePicture`=?,`coverPicture`=? WHERE id=? ";

        db.query(
            q,
            [
                req.body.name,
                req.body.city,
                req.body.website,
                req.body.profilePicture,
                req.body.coverPicture,
                userInfo.id,
            ],
            (err, data) => {
                if (err) {
                    res.status(500).json(err);
                }
                if (data.affectedRows > 0) {
                    return res.json("Updated!");
                }
                return res.status(403).json("You can update only your post!");
            }
        );


    });
}

export const getFriendUsers = (req, res) => {
    const userId = req.query.userId;

    const token = req.cookies.accessToken;
    if (!token) {
        return res.status(401).json("Not logged in!!")
    }

    jwt.verify(token, "secretkey", (err, userInfo) => {
        console.log("userInfo",userInfo)
        if (err) {
            return res.status(400).json("Wrong password or username!")
        }

        const q = 
            `SELECT u.id, users.id as userId, users.name, users.profilePicture
            FROM users AS u JOIN relationships AS r ON (u.id = r.followerUserId)
            JOIN users ON (users.id = r.followedUserId)
            WHERE r.followerUserId = ?`
            

        const values =  [userId]

        db.query(q, values, (err, data) => {
            if (err) {
                res.status(500).json(err);
            }
            return res.status(200).json(data);
        })
    });
}