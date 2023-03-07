import express from 'express';
import {getUser, updateUser, getFriendUsers} from './../controllers/userController.js'

const router = express.Router();

const userRoutes = app => {
    router.get('/find/:userId', getUser)
    router.get('/friends', getFriendUsers);
    router.put('/users', updateUser)

    return app.use('/api/v1/', router)
}

export default userRoutes;