const express = require("express");
const Leaderboard =  require('../models/leaderboardModel');
const leaderboardRouter = express.Router();
leaderboardRouter.route('/')
    .get((req, res) => {
		var redisClient = req.app.get('redisio');
		
		redisClient.zrevrange("leaderboard", 0, 10, function (err, list) {
			if (err) throw err;
			
			var userList = [];
			for (i in list)
			{
				var redisRawKey = list[i] + "_raw";
				redisClient.get(redisRawKey, function (error, result) {
					if (error) {
						console.log(error);
						throw error;
					}
					
					userList.push(result);					
					if(userList.length == list.length)
					{
						res.json(userList);
					}
				});
			}
		});
    })
    .post((req, res) => {
        let leaderboard = new Leaderboard(req.body);
        leaderboard.save();
        res.status(201).send(leaderboard);
    })
	
leaderboardRouter.route('/all')
    .get((req, res) => {
        Leaderboard.find({}, (err, leaderboard) => {
			res.json(leaderboard);
        })  
    })
	
leaderboardRouter.route('/count/:time')
    .get((req, res) => {
		var timeList = req.params.time.split("-");
		if(timeList.length == 2)
		{		
			Leaderboard.find({'updateHistory.timeChange': { $gt: Number(timeList[0]), $lt: Number(timeList[1])},}, (err, leaderboard) => {
				if(leaderboard)
				{
					var data = {
						"count": leaderboard.length,
						"detail": leaderboard
					}
					res.json(data);
				}
				else
				{
					res.status(500).send("Wrong time format");
				}
			})
		}
		else
		{
			res.status(500).send("Wrong time format");
		}
    })

// Middleware 
leaderboardRouter.use('/:userId', (req, res, next)=>{
    Leaderboard.findById( req.params.userId, (err,leaderboard)=>{
        if(err) {
            res.status(500).send(err);
		}
        else {
            req.leaderboard = leaderboard;
            next()
        }
    })

})
leaderboardRouter.route('/:userId')
    .get((req, res) => {
        res.json(req.leaderboard);
    })	//get
    .put((req,res) => {
		
		if(req.body.username)
		{			
			req.leaderboard.username = req.body.username;
		}
		
		if(req.body.score && req.leaderboard.score != req.body.score)
		{
			var seconds = new Date().getTime() / 1000;
			
			req.leaderboard.updateHistory.numberUpdate = req.leaderboard.updateHistory.numberUpdate + 1;			
			req.leaderboard.updateHistory.timeChange.push(seconds);
			
			// update redis data
			var redisClient = req.app.get('redisio');			
			redisClient.zadd("leaderboard", req.body.score, req.params.userId);
			
			// emit one signal to client
			var io = req.app.get('socketio');			
			io.emit('UpdateScore', req.leaderboard.username);
			
			// update new score on MongoDB
			req.leaderboard.score = req.body.score;
			
			var redisRawKey = req.params.userId + "_raw";
			
			var data = {
				"username": req.leaderboard.username,
				"score": req.body.score
			}
			// redisClient.set(redisRawKey, JSON.parse(data));
			console.log('Update ->' + redisRawKey + ' = ' + JSON.stringify(data));
			
			redisClient.set(redisRawKey, JSON.stringify(data));
		}
		
		if(req.body.username || req.body.score)
		{
			req.leaderboard.save();
			res.json(req.leaderboard);
		}
		
    })	//put
    .delete((req,res)=>{
        req.leaderboard.remove(err => {
            if(err){
                res.status(500).send(err);
            }
            else{
                res.status(204).send('removed');
				
				// sync with Redis
				var redisClient = req.app.get('redisio');
				var redisRawKey = req.params.userId + "_raw";				
				redisClient.zrem("leaderboard", req.params.userId);
				redisClient.del(redisRawKey);
            }
        })
    })	//delete
	 
module.exports = leaderboardRouter;