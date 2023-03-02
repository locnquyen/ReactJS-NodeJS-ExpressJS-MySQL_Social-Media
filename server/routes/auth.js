import express from 'express';
import {login, register, logout} from './../controllers/authController.js'

const router = express.Router();

const authRoutes = app => {
    router.post('/login', login );
    router.post('/register', register );
    router.post('/logout', logout );

    return app.use('/api/auth/', router)
}

export default authRoutes;