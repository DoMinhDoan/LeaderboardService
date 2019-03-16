const express = require("express");
const Leaderboard =  require('../models/leaderboardModel');
const leaderboardRouter = express.Router();
leaderboardRouter.route('/')
    .get((req, res) => {
        Leaderboard.find({}, (err, leaderboard) => {
            console.log('leaderboardRouter / GET');
			res.json(leaderboard)
        })  
    })
    .post((req, res) => {
        let leaderboard = new Leaderboard(req.body);
        leaderboard.save();
        res.status(201).send(leaderboard) 
    })

// Middleware 
leaderboardRouter.use('/:userId', (req, res, next)=>{
    Leaderboard.findById( req.params.userId, (err,leaderboard)=>{
        if(err) {
            res.status(500).send(err)
			console.log('leaderboardRouter userId : ' + err);
		}
        else {
            req.leaderboard = leaderboard;
            next()
        }
    })

})
leaderboardRouter.route('/:userId')
    .get((req, res) => {
        res.json(req.leaderboard)
    })	//get
    .put((req,res) => {
		if(req.leaderboard.score != req.body.score)
		{
			// emit one signal to client
			var io = req.app.get('socketio');			
			io.emit('UpdateScore', req.body.username);
		}
        req.leaderboard.username = req.body.username;
        req.leaderboard.score = req.body.score;
        req.leaderboard.updateHistory = req.body.updateHistory;
        req.leaderboard.save()
        res.json(req.leaderboard)
		
		
    })	//put
    .delete((req,res)=>{
        req.leaderboard.remove(err => {
            if(err){
                res.status(500).send(err)
            }
            else{
                res.status(204).send('removed')
            }
        })
    })	//delete
	 
module.exports = leaderboardRouter;