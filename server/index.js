import express from "express";
const app = express();

import userRoutes from './routes/users.js';
import authRoutes from './routes/auth.js';

import commentRoutes from './routes/comments.js';
import postRoutes from './routes/posts.js';

import likeRoutes from './routes/likes.js';
import relationshipRoutes from './routes/relationships.js';
import conversationRoutes from './routes/conversations.js';
import messageRoutes from './routes/messages.js';


import cookieParser from 'cookie-parser'
import multer from 'multer'

import cors from 'cors'

//middleware
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Credentials", true)
    next()
})
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:3000"
}));

//multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, '../client/public/upload')
    },
    filename: function (req, file, cb) {
        cb(null,Date.now() + file.originalname)
    }
})

const upload = multer({ storage: storage })

app.post("/api/upload", upload.single("file"), (req, res)=> {
    const file = req.file;
    res.status(200).json(file.filename)
})

//init user router
userRoutes(app);
authRoutes(app);
commentRoutes(app);
postRoutes(app);
likeRoutes(app);
relationshipRoutes(app)
conversationRoutes(app)
messageRoutes(app)

app.listen(8080, function () {
    console.log("API working port 8080");
})

app.get("/", function (req, res) {
    res.send("Welcome")
})