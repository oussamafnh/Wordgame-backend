// controllers/questions.ts

import express from 'express';
import { getQuestionsByLevel, createQuestion, getQuestionsById } from '../db/questions';
import { startGameSession, getGameSessionById, answerQuestion } from '../db/gamesession';
import {getPtsByLevelNumber} from '../db/levels';

export const getQuestionsForLevel = async (req: express.Request, res: express.Response) => {
    try {
        const level = parseInt(req.params.level);
        const questions = await getQuestionsByLevel(level);
        res.status(200).json(questions);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const createNewQuestion = async (req: express.Request, res: express.Response) => {
    try {
        const { level, words, correct_answer } = req.body;
        const question = await createQuestion(level, words, correct_answer);
        res.status(201).json(question);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const answerQuestions = async (req: express.Request, res: express.Response) => {
    try {
        const question_id = req.params.questionId;
        const { answer } = req.body;
        const question = await getQuestionsById(question_id);
        if (!question) {
            return res.status(404).json({ message: 'question not found' });
        }

        // const correctQuestion = question.correct_answer === answer;
        const correctAnswer = question.correct_answer.toLowerCase();
        const userAnswer = answer.toLowerCase();
        
        const correctQuestion = correctAnswer === userAnswer;
        if (correctQuestion) {
            const { SessionId } = req.cookies;
            const newLevel = question.level;
            const pointsValueperlvl = await getPtsByLevelNumber(newLevel);
            const pointsEarned = pointsValueperlvl.point_value_per_question;
            const newStatus = 'active';
            const xsession = await getGameSessionById(SessionId);
            if (xsession.status === 'completed' || xsession.status === 'abandoned') {
                res.json({ message: 'Cannot answer questions for completed or abandoned game sessions' });
            }
            if (newLevel < xsession.current_level) {
                res.json({ message: 'Cannot go back to previous level' });
            }
            const session = await answerQuestion(SessionId, pointsEarned, newLevel, newStatus);
            if (!session) {
                return res.status(404).json({ message: 'Game session not found' });
            }
            res.status(200).json({ message: 'Correct answer!' });
        } else {
            res.status(400).json({ message: 'Incorrect answer' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const getThreeRandomQuestions = async (req: express.Request, res: express.Response) => {
    try {
        const { SessionId } = req.cookies;
        const Session = await getGameSessionById(SessionId);
        if (Session.status === 'completed' || Session.status === 'abandoned') {
            res.json({ message: 'Cannot get questions for completed or abandoned game sessions' });
        };
        const currentLevel = Session.current_level; 

        const questions = await getQuestionsByLevel(currentLevel);

        const shuffledQuestions = questions.sort(() => Math.random() - 0.5);

        const level = await getPtsByLevelNumber(currentLevel);
        const numQuestions = level.num_questions;

        const selectedQuestions = shuffledQuestions.slice(0, numQuestions).map(question => ({
            _id: question._id,
            level: question.level,
            words: question.words,
            length: question.correct_answer.length
        }));

        res.status(200).json(selectedQuestions);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};


