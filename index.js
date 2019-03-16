require('dotenv').config()

var port = process.env.PORT || 3000;

var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var uuid = require("uuid");

const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const leadboardRouter = require("./Routes/leaderboardRouter");

server.listen(port);
console.log("server started on port " + port);

// Connecting to the database
const con = mongoose
  .connect(
    process.env.DB_ADDRESS,
    { useNewUrlParser: true } //need this for api support
  )
  .then(() => console.log("mongoDB connected"))
  .catch(err => console.log(err));

// setting body parser middleware 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// API routes
app.use('/api/leaderboard', leadboardRouter);


// Persistent Socket Connection

var players = [];

// app.get('/', function (req, res) {
  // res.sendFile(__dirname + '/index.html');
// });

io.on('connection', function (socket) {
  socket.emit('news', { hello: 'world' });
  socket.on('my other event', function (data) {
    console.log('my other event' + data);
  });
});

