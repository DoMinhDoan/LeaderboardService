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

## Setup and Run

1. Copy .env.template -> .env then config with correctly url/post for MongoDB + Redis.
1. There is `docker-compose` where you can setup one docker with MongoDB + Redis on localhost. Into `docker-compose` folder, run `docker-compose up`.
1. From project folder, run `node index.js`

## API's Testcase

1. User : `http://localhost:3000/`
	* _Click_ `New User` if you are new and want to connect to services.
	* Or _Input_ your id (_id and key for the user) to login.
		* Input id ( ex : `5c8dcb1966bacc078c3b63a7`) -> `Connect`
		* If you input wrong ID, you should get error message.
	* After connected, you can update the `User Name` or "Score".
		* Input json( ex : `{"username":"New Name","score":100}` ) -> `Update`
		* Can change for every paramater.
	* You also get the message when another users update their score.
		* Like `User New Name updated with new score`.
	* If you would like to have the new life, try to click `Delete`.
	
2. Administrator : `http://localhost:3000/admin`
	* As an administrator I should be able to delete a username and score.
		* Click `Delete` button on each table row.
	* In here, you can see more detail about your user : the change score count and what time they did.
	* As an administrator I should be able to see how many users updated their score in a time window. 
		* http://localhost:3000/admin/statistics
		* Input in format : `{"start":"2016-11-22T17:14:00","stop":"2020-11-22T17:14:00"}`
		
		
3. Postman
	* All APIs designed that Postman can perform test quickly.
	* GET
		* http://localhost:3000/api/leaderboard/all
			* Get all user information.
		* http://localhost:3000/api/leaderboard/
			* TOP 10 leaderboard with Redis supported.
		* http://localhost:3000/api/leaderboard/{userID}
			* Get info about one user via ID.
			* Ex : `http://localhost:3000/api/leaderboard/5c8dca7aaedcda1868e01b4e`
		* http://localhost:3000/api/leaderboard/count/{start-stop}
			* Get info for users who upadted their score begin from start and end at stop time.
			* Ex : `http://localhost:3000/api/leaderboard/count/1552800213-1552800214.5`
	* POST
		* http://localhost:3000/api/leaderboard/
			* Added new user
			* Json body with content need to add.
			* Ex : `{"username":"MDoan","score":100}`
	* PUT
		* http://localhost:3000/api/leaderboard/{userID}
			* Update with new info.
			* Json body with content need to update.
			* Ex : {"username":"HaiAnh","score":100}
	* DELETE
		* http://localhost:3000/api/leaderboard/{userID}
			* Delete the user by ID.		


## Special Thanks

This section lists people who have contributed to this project by writing code, improving documentation or fixing bugs.

* [Reference]()
