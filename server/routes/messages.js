import express from "express";
import { getMessages, addMessage } from './../controllers/messageController.js'


const router = express.Router();

const messageRoutes = app => {
    router.get('/messages',getMessages );
    router.post('/message', addMessage );

    return app.use('/api/v1/', router);
}

export default messageRoutes;