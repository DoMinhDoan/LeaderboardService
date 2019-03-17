# Leaderboard Service Challenge


## Description

Implement a leaderboard service that could be consumed by a game client.  This service will be run on a remote server from the client.

## API's Supported

* HTTP REST
* Persistent Socket Connection

## Features:

1. As a user I should be able to add/update a username and a score.
1. As a user I should be able to receive updates pushed to my screen when another user adds/updates their score.
1. As an administrator I should be able to see how many users updated their score in a time window.
1. As an administrator I should be able to see how many times a user updated their score.
1. As an administrator I should be able to delete a username and score.


## Frameworks

* Database
	* MongoDB - Mongoose - for normal query
	* Redis - for heavy query like leaderboard
* Environment
	* Nodejs
	* Express
	* SocketIO
	* Body-parser

## Setup

1. Clone .env.template -> .env then config with correctly url/post for MongoDB + Redis.
2. There is docker-compose where you can setup one docker with MongoDB + Redis on localhost
3. From project folder, Run `node index.js`

## Run the Project



## Special Thanks

This section lists people who have contributed to this project by writing code, improving documentation or fixing bugs.

* [Reference]()
