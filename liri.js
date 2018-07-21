require("dotenv").config();
var request = require("request");
var fs = require("fs");
var keys = require("./keys.js");

// console.log(keys);

var Twitter = require('twitter');
var Spotify = require('node-spotify-api');

// First get the client arguments
var command = process.argv[2];
var input = process.argv[3];

// Decide action
switch (command) {
    case 'my-tweets': 
        getMyTweets();
        break;        
    case 'spotify-this-song': 
        songInfo();
        break;
    case 'movie-this':
        movieInfo();
        break;
    case 'do-what-it-says':
        whatItSays();
        break;
    default: 'invalid command';
};
 

function getMyTweets() {
    var client = new Twitter(keys.twitter);
    // console.log(client);    
    client.get("statuses/user_timeline", {}, function(error, tweets, response) {
        if (error) throw error;
        // console.log(tweets);
        tweets.forEach(tweet => {
            console.log(tweet.text);
        })
    })
}

function songInfo() {
var spotify = new Spotify(keys.spotify);
spotify.search({ type: 'track', query: input}, function(err, data) {
    if (err) {
      return console.log('Error occurred: ' + err);
    }
   
  console.log("Artists' Name: " + data.tracks.items[0].album.artists[0].name);
  console.log("Song Name: " + data.tracks.items[0].name); 
  console.log("Preview URL: " + data.tracks.items[0].album.external_urls.spotify);  
  console.log("Album: " + data.tracks.items[0].album.name);
  
  });
}

function movieInfo() {
request('http://www.omdbapi.com/?t=' + input + '&y=&plot=short&apikey=trilogy', function (error, response, body) {
   
 if (!error && response.statusCode === 200) {
    console.log("The movie's title is: " + JSON.parse(body).Title);
    console.log("The year of the movie's release: " + JSON.parse(body).Released);
    console.log("The movie's rating is: " + JSON.parse(body).imdbRating);
    console.log("The movie's Rotten Tomatoes rating is: " + JSON.parse(body).Ratings[1].Value);
    console.log("The movie's was produced in: " + JSON.parse(body).Country);
    console.log("The movie is avaialbe in the following languages: " + JSON.parse(body).Language);
    console.log("The movie's plot: " + JSON.parse(body).Plot);
    console.log("The Actor's in the movie are: " + JSON.parse(body).Actors);
  }   
  
});
};


function whatItSays() {

 fs.readFile("./random.txt", "utf8", function(error, data) {

    // If the code experiences any errors it will log the error to the console.
    if (error) {
      return console.log(error);
    }
  
    // We will then print the contents of data
    console.log("node liri " + data);
  
  });
}

