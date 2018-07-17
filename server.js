'use strict'

// const fetch = require('node-fetch')
const express = require('express');
const bodyParser =require('body-parser');
const cors = require('cors');
const request = require("request");


const twitter_api = 'https://api.twitter.com/1.1/search/tweets.json';
const bearer_token = 'AAAAAAAAAAAAAAAAAAAAAEUl6wAAAAAAYctnbkuR1XL5CNjrPTBRON%2FmFfM%3D3kOOQjOZg0KpGNZyajj3dh7gPQFjj0gmYKdveohBz7TdTRlysZ'; 

const app = express();
app.use(bodyParser.json());
app.use(cors());

//This pings the Heroku server immediately upon page load.
app.get('/wakeUp/', function (req, res){
  res.send('RRRRRR')
})

//This gets info from the Twitter search API.
app.post('/', async function(req, res){
  // First we search with the topic they user entered
  let response = await twitterCall(req.body.search)
  // If it returns any tweets then we're good.
  if(typeof response.statuses[0] === 'object'){
    res.send(response)
  // If not we just get some 'perfect' tweets instead
  }else{
    response = await twitterCall('perfect')
    res.send(response)
  }
  
});

const twitterCall = (topic) =>{
  const options = {
    method: 'GET',
    url: twitter_api, 
    qs: {
      q: topic,
      'result_type':'popular',
      'tweet_mode':'extended',
      lang:'en',
      count: 10,
    },
    json: true,
    headers: {
      "Authorization": "Bearer " + bearer_token
    }
  };
  return new Promise(function(resolve, reject) {
    request.get(options, function(err, resp, body) {
      if (err) {
        reject(err);
      } else {
        resolve(body)
      }
    })
  })

} 

const port = process.env.PORT || process.env.VCAP_APP_PORT || 3005;
app.listen(port, function() {
 console.log(`app is running on port ${port}`);
});