import mongoose from 'mongoose';

const LeaderboardSchema = new mongoose.Schema({
    player_id: {
        type: String,
        required: true,
        unique: true
    },
    score: {
        type: Number,
        required: true
    }
});

const LeaderboardModel = mongoose.model('Leaderboard', LeaderboardSchema);

export const getLeaderboard = () => LeaderboardModel.find().sort({ score: -1 });

export const updateLeaderboard = async (playerId: string, newScore: number) => {
    try {
        const existingEntry = await LeaderboardModel.findOne({ player_id: playerId });

        if (existingEntry) {
            existingEntry.score = newScore;
            await existingEntry.save();
        } else {
            await new LeaderboardModel({ player_id: playerId, score: newScore }).save();
        }
    } catch (error) {
        throw new Error('Failed to update leaderboard');
    }
};

export default LeaderboardModel;
