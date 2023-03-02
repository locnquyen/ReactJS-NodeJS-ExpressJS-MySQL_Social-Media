import express from "express";
import { getConversations, addConversation } from './../controllers/conversationController.js'


const router = express.Router();

const conversationRoutes = app => {
    router.get('/conversations',getConversations );
    router.post('/conversation', addConversation );

    return app.use('/api/v1/', router);
}

export default conversationRoutes;