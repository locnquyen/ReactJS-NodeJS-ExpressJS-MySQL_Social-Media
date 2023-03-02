import express from 'express';
import {getRelationships, addRelationship, deleteRelationship} from './../controllers/relationshipController.js'

const router = express.Router();

const likeRoutes = app => {
    router.get('/relationships', getRelationships);
    router.post('/relationships', addRelationship);
    router.delete('/relationships', deleteRelationship);

    return app.use('/api/v1/', router);
}

export default likeRoutes;