import express from 'express';
import { createALevel } from '../controllers/levels';

export default (router: express.Router) => {
    router.post('/levels/create',createALevel );
};

