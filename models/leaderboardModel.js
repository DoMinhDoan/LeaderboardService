const mongoose = require("mongoose");

const Schema = mongoose.Schema; 

const leaderboardModel = new Schema({
	username: { type: String },
	score: { type: Number },
	updateHistory: { type: String }
});
module.exports = mongoose.model('leaderboard', leaderboardModel)