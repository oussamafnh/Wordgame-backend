import express from "express";


import authentication from "./authentication";
import gamesession from "./gamesession";
import questions from "./questions";
import levels from "./levels";
import leaderboard from "./leaderboard";

const router = express.Router();

export default (): express.Router => {
    authentication(router);
    gamesession(router);
    questions(router);
    levels(router);
    leaderboard(router);
    return router;
}