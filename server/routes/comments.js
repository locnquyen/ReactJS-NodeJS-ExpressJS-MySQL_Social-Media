import express from 'express';
import {getComments, addComment} from './../controllers/commentController.js'

const router = express.Router();

const commentRoutes = app => {
    router.get('/comments', getComments ); 
    router.post('/comments', addComment ); 

    return app.use('/api/v1/', router)
}

export default commentRoutes;