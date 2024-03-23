import express from 'express';
import { startSession, getSessionById, answerQuestionInSession } from '../controllers/gamesession';
import { requireLogin } from '../middleware/auth';

export default (router: express.Router) => {
    router.post('/session/start', startSession);
    router.get('/session', getSessionById);
    router.post('/session/answer', answerQuestionInSession);
};
