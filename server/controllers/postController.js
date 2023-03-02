import { db } from "../configs/connectDB.js";
import jwt from 'jsonwebtoken';
import moment from "moment";


export const getPosts = (req, res, next) => {

    const userId = req.query.userId;

    const token = req.cookies.accessToken;
    if (!token) {
        return res.status(401).json("Not logged in!!")
    }

    jwt.verify(token, "secretkey", (err, userInfo) => {
        if (err) {
            return res.status(400).json("Wrong password or username!")
        }

        const q = userId !== "undefined" ?
            `SELECT p.*, u.id AS userId, name, profilePicture FROM posts AS p JOIN users AS u ON (u.id = p.userId)
        WHERE p.userId = ? ORDER BY p.createdAt DESC`
            :
            `SELECT p.*, u.id AS userId, name, profilePicture FROM posts AS p JOIN users AS u ON (u.id = p.userId)
        LEFT JOIN relationships AS r ON (p.userId = r.followedUserId)  WHERE r.followerUserId= ? OR p.userId = ?
        ORDER BY p.createdAt DESC`

        const values = userId !== "undefined" ? [userId] : [userInfo.id, userInfo.id]

        db.query(q, values, (err, data) => {
            if (err) {
                res.status(500).json(err);
            }
            return res.status(200).json(data);
        })
    });
}

export const addPost = (req, res) => {
    const token = req.cookies.accessToken;
    if (!token) {
        return res.status(401).json("Not logged in!!")
    }

    jwt.verify(token, "secretkey", (err, userInfo) => {
        if (err) {
            return res.status(400).json("Wrong password or username!")
        }

        const q =
            "INSERT INTO posts(`description`, `img`, `createdAt`, `userId`) VALUES (?)";

        const values = [
            req.body.desc,
            req.body.img,
            moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
            userInfo.id,
        ];

        db.query(q, [values], (err, data) => {
            if (err) {
                res.status(500).json(err);
            }
            return res.status(200).json("Post have been created")
        })
    });

}

export const deletePost = (req, res) => {
    const token = req.cookies.accessToken;
    if (!token) {
        return res.status(401).json("Not logged in!!")
    }

    jwt.verify(token, "secretkey", (err, userInfo) => {
        if (err) {
            return res.status(400).json("Wrong password or username!")
        }

        const q =
            "DELETE FROM posts WHERE `id`=? AND `userId` = ?";

        db.query(q, [req.params.id, userInfo.id], (err, data) => {
            if (err) {
                res.status(500).json(err);
            }
            if (data.affectedRows > 0) {
                return res.status(200).json("Post have been deleted")
            }
            return res.status(403).json("You can delete only your post")
        })
    });

}