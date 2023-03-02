import express from 'express';
import { getPosts, addPost, deletePost } from './../controllers/postController.js'


const router = express.Router();

const postRoutes = app => {
    router.get('/posts',getPosts );
    router.post('/posts', addPost );
    router.delete('/posts/:id', deletePost );

    return app.use('/api/v1/', router);
}

export default postRoutes;