import mongoose from 'mongoose';

const QuestionSchema = new mongoose.Schema({
    level: {
        type: Number,
        required: true
    },
    words: {
        type: [String],
        required: true
    },
    correct_answer: {
        type: String,
        required: true
    }
});

const QuestionModel = mongoose.model('Question', QuestionSchema);

export const getQuestionsByLevel = (level: number) => QuestionModel.find({ level });

export const getQuestionsById = (id: string) => QuestionModel.findById(id);

export const createQuestion = (level: number, words: string[], correctAnswer: string) => {
    return new QuestionModel({
        level,
        words,
        correct_answer: correctAnswer
    }).save();
};

export default QuestionModel;
