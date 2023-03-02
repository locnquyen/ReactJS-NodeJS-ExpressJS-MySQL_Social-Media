import { db } from "../configs/connectDB.js"
import bcrypt from 'bcryptjs'

import jwt from 'jsonwebtoken';

export const register = (req, res, next) => {
    console.log("req", req);
    //check user if exist
    const q = "select * from users where username = ?"

    db.query(q, [req.body.username], (err, data) => {
        if (err) {
            return res.status(500).json(err)
        }
        if (data.length) {
            return res.status(409).json("User already exists!");
        }
        if (!req.body.password || !req.body.username) {
            return res.status(409).json("Can't create user");
        }

        //create a new user
        // hash the password
        var salt = bcrypt.genSaltSync(10);
        var hashedPassword = bcrypt.hashSync(req.body.password, salt);
        const q = "INSERT INTO users (`username`,`email`,`password`,`name`) VALUE (?)"

        //create value into
        const values = [
            req.body.username,
            req.body.email,
            hashedPassword,
            req.body.name,
        ];

        db.query(q, [values], (err, data) => {
            if (err) return res.status(500).json(err);
            return res.status(200).json("User has been created.");
        });
    })


}

export const login = (req, res, next) => {
    console.log("req", req);


    const q = "select * from users where username = ?"

    db.query(q, [req.body.username], (err, data) => {
        //throw error
        if (err) {
            return res.status(550).json(err)
        }
        //check user
        if (data.length === 0) {
            return res.status(409).json("User not found!")
        };

        if (!req.body.password) {
            return res.status(409).json("Password is not valid!");
        };

        const checkPassword = bcrypt.compareSync(req.body.password, data[0].password);
        if (!checkPassword) {
            return res.status(400).json("Wrong password or username!!")
        }
        //token
        const token = jwt.sign({ id: data[0].id }, 'secretkey');

        const { password, ...others } = data[0];

        res.cookie("accessToken", token, { httpOnly: true }).status(200).json(others);
    })



}

export const logout = (req, res, next) => {
    res.clearCookie("accessToken", {
        secure: true,
        sameSite: "none",

    }).status(200).json("User has been logged out");
}