require("dotenv").config();
var request = require("request");
var fs = require("fs");
var keys = require("./keys.js");

// console.log(keys);

var Twitter = require('twitter');
var Spotify = require('node-spotify-api');

// First get the client arguments
var command = process.argv[2];
var input = process.argv.splice(3).join(" ");

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
    // i need the error to default to "The Sign by Ace of Base"
    if (err) return console.log('Error occurred: ' + err);
    
   
  console.log("Artists' Name: " + data.tracks.items[0].album.artists[0].name);
  console.log("Song Name: " + data.tracks.items[0].name); 
  console.log("Preview URL: " + data.tracks.items[0].album.external_urls.spotify);  
  console.log("Album: " + data.tracks.items[0].album.name);
  
  });
}

function movieInfo() {
request('http://www.omdbapi.com/?t=' + input + '&y=&plot=short&apikey=trilogy', function (error, response, body) {
   if (error) return console.log(error);

   var jsonData = JSON.parse(body)

    var movieData = [
    "Movie Title: " + jsonData.Title,
    "Release Year: " + jsonData.Released,
    "Rating: " + jsonData.imdbRating,
    "Rotten Tomatoes rating: " + jsonData.Ratings[1].Value,
    "Country Produced: " + jsonData.Country,
    "Available in: " + jsonData.Language,
    "Plot: " + jsonData.Plot,
    "Actors: " + jsonData.Actors,
    ].join("\n\n");
    writeToLogs(movieData, function(err) {
    if (err) throw err;
    console.log(movieData);      
  })
  // here i need to error to default to Mr. Noboby
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
    
    // I need to push this "data" to run in node app
  
  });
}

function writeToLogs(text, callback) {
    const divider = "\n------------------------------------------------------------\n\n";
    // Append showData and the divider to log.txt, print showData to the console
    fs.appendFile("log.txt", text + divider, callback);
  }

