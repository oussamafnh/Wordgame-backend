import express from 'express';
import { getLeaderboardStandings, updateLeaderboardEntry } from '../controllers/leaderboard';


export default (router: express.Router) => {
    router.get('/Leaderboard', getLeaderboardStandings);
    router.post('/Leaderboard/update', updateLeaderboardEntry);
};
