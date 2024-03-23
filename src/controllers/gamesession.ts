import express from 'express';
import { startGameSession, getGameSessionById, answerQuestion } from '../db/gamesession';
import { getUserBySessionToken } from '../db/user';
import {  updateLeaderboard } from '../db/leaderboard';

export const startSession = async (req: express.Request, res: express.Response) => {
    try {
        const { APP_AUTH } = req.cookies;
        const user = await getUserBySessionToken(APP_AUTH);
        const playerId = user.id;
        const { currentLevel } = req.body;
        const session = await startGameSession(playerId, currentLevel);
        res.cookie('SessionId', session.id);
        res.status(201).json(session);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const getSessionById = async (req: express.Request, res: express.Response) => {
    try {
        const { SessionId } = req.cookies;
        const session = await getGameSessionById(SessionId);
        if (!session) {
            return res.status(404).json({ message: 'Game session not found' });
        }
        res.status(200).json(session);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};



export const answerQuestionInSession = async (req: express.Request, res: express.Response) => {
    try {
        const { SessionId } = req.cookies;
        const { pointsEarned, newLevel, newStatus } = req.body;
        const xsession = await getGameSessionById(SessionId);

        if (xsession.status === 'completed' || xsession.status === 'abandoned') {
            res.json({ message: 'Cannot answer questions for completed or abandoned game sessions' });
            return;
        }

        if (newLevel < xsession.current_level) {
            res.json({ message: 'Cannot go back to previous level' });
            return;
        }
        const playerId = xsession.player_id;
        const newScore = xsession.points_earned ;

        // Update leaderboard if the session is completed or abandoned
        if (newStatus === 'completed' || newStatus === 'abandoned') {
            await updateLeaderboard(playerId, newScore);
        }

        // Clear the session cookie
        res.clearCookie('SessionId');

        // Update the game session
        const session = await answerQuestion(SessionId, pointsEarned, newLevel, newStatus);

        if (!session) {
            return res.status(404).json({ message: 'Game session not found' });
        }

        res.status(200).json(session);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
