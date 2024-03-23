import express from 'express';
import {createLevel} from "../db/levels";

export const createALevel = async (req: express.Request, res: express.Response) => {
  try {
    const {level_number, num_questions, point_value_per_question} = req.body;
    const level = await createLevel({level_number, num_questions, point_value_per_question});
    res.status(201).json(level);
  } catch (err) {
    console.error(err);
    res.status(500).json({message: 'Internal server error'}); 
  }
};
