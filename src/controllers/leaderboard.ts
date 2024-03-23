import express from 'express';
import { getLeaderboard, updateLeaderboard } from '../db/leaderboard';

export const getLeaderboardStandings = async (req: express.Request, res: express.Response) => {
    try {
        const leaderboard = await getLeaderboard();
        res.status(200).json(leaderboard);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const updateLeaderboardEntry = async (req: express.Request, res: express.Response) => {
    try {
        const { playerId, newScore } = req.body;
        await updateLeaderboard(playerId, newScore);
        res.status(200).json({ message: 'Leaderboard updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
