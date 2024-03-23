import mongoose from 'mongoose';

const LevelSchema = new mongoose.Schema({
    level_number: {
        type: Number,
        required: true
    },
    num_questions: {
        type: Number,
        required: true
    },
    point_value_per_question: {
        type: Number,
        required: true
    }
});

const LevelModel = mongoose.model('Level', LevelSchema);

export const getAllLevels = () => LevelModel.find();
export const getPtsByLevelNumber = (level_number: number) =>LevelModel.findOne({ level_number: level_number });
export const createLevel = (values: Record<string, any>) => new LevelModel(values).save().then((level) => level.toObject());

export default LevelModel;