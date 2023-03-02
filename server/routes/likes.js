import express from 'express';
import {getLikes, addLike, deleteLike} from './../controllers/likeController.js'

const router = express.Router();

const likeRoutes = app => {
    router.get('/likes', getLikes);
    router.post('/likes', addLike);
    router.delete('/likes', deleteLike);

    return app.use('/api/v1/', router);
}

export default likeRoutes;