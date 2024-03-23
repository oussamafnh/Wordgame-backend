import mongoose from "mongoose";

const GameSessionSchema = new mongoose.Schema({
    player_id: {
        type: String,
        required: true,
        unique: true
    },
    current_level: {
        type: Number,
        required: true
    },
    points_earned: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        enum: ['active', 'completed', 'abandoned'],
        default: 'active'
    }
});

const GameSessionModel = mongoose.model('GameSession', GameSessionSchema);

export const startGameSession = (playerId: string, currentLevel: number) => {
    return new GameSessionModel({
        player_id: playerId,
        current_level: currentLevel
    }).save();
};

export const getGameSessionById = (sessionId: string) => GameSessionModel.findById(sessionId);

export const getAllUsers = () => GameSessionModel.find();


export const answerQuestion = async (sessionId: string, pointsEarned: number, newLevel: number, newStatus: string) => {
    const session = await GameSessionModel.findByIdAndUpdate(sessionId, {
        $inc: { points_earned: pointsEarned },
        $set: { current_level: newLevel, status: newStatus }
    }, { new: true });
    return session;
};

export default GameSessionModel;
