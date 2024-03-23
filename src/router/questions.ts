import express from 'express';
import { getQuestionsForLevel, createNewQuestion ,answerQuestions , getThreeRandomQuestions} from '../controllers/questions';

export default (router: express.Router) => {
    router.get('/questions/:level', getQuestionsForLevel);
    router.get('/questions', getThreeRandomQuestions);
    router.post('/questions/create', createNewQuestion);
    router.post('/questions/:questionId/answer', answerQuestions);
};
