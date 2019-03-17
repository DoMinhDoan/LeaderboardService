require('dotenv').config()

var port = process.env.PORT || 3000;

var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);

var redis = require('redis');
var redisClient = redis.createClient(process.env.REDIS_PORT, process.env.REDIS_ADDRESS); // this creates a new client

var mongoose = require("mongoose");
var bodyParser = require("body-parser");
var leadboardRouter = require("./Routes/leaderboardRouter");

server.listen(port);
console.log("server started on port " + port);

// Connecting to the database
const con = mongoose
  .connect(
		process.env.MONGO_ADDRESS,
    { useNewUrlParser: true } //need this for api support
  )
  .then(() => console.log("mongoDB connected"))
  .catch(err => console.log(err));
  
  
// redis database
redisClient.on('connect', function() {
    console.log('Redis client connected');
});

redisClient.on('error', function (err) {
    console.log('Something went wrong ' + err);
});

app.set('redisio', redisClient);
app.set('socketio', io);

// setting body parser middleware 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

app.get('/admin', function (req, res) {
  res.sendFile(__dirname + '/admin.html');
});

app.get('/admin/statistics', function (req, res) {
  res.sendFile(__dirname + '/statistics.html');
});


// API routes
app.use('/api/leaderboard', leadboardRouter);


// Persistent Socket Connection
io.on('connection', function (socket) {
  console.log('...a user connected...');
  socket.on('disconnect', function(){
    console.log('...a user disconnected...');
  });  
});

