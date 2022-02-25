require("dotenv").config();

const express = require("express");
const querystring = require('querystring'); //lets us parse and stringify query strings
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const port = 8080;

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;


// // IMPORT YOUR SCHEMAS HERE
// ////////
// require("./models/Profiles"); //This is just an example. Don't forget to delete this

const app = express();
const axios = require("axios");   //installed the axios dependency using 'npm install axios --save'

// This is where your API is making its initial connection to the database
///////
// mongoose.Promise = global.Promise;
// mongoose.connect(process.env.DATABASE_CONNECTION_STRING, {
//   useNewUrlParser: true,
// });

// app.use(bodyParser.json());

// IMPORT YOUR API ROUTES HERE
// Below is just an example. Don't forget to delete it. 
// It's importing and using everything from the profilesRoutes.js file and also passing app as a parameter for profileRoutes to use
// require("./routes/profilesRoutes")(app); 
/////


/**
 * Generates a random string containing numbers and letters
 * @param  {number} length The length of the string
 * @return {string} The generated string
 */
 const generateRandomString = length => {
  let text = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};


const stateKey = 'spotify_auth_state';

/**
 * Set up a route handler for the /login endpoint
 * Added the required Spotify query parameters for the /authorize endpoint: client_id, response_type, and redirect_uri
 * Add state and scope query params (optional)
 */ 
app.get('/login', (req, res) => {    //added a simple route handler for the index page
  const state = generateRandomString(16);
  res.cookie(stateKey, state);

  const scope = [
    'user-read-private',
    'user-read-email',
    'user-top-read',
  ].join(' ');

  const queryParams = querystring.stringify({   //querystring.stringify() takes an object with keys & values & serializes them into a query string
    //swap querystring for URLSearchParams
    client_id: CLIENT_ID,
    response_type: 'code',
    redirect_uri: REDIRECT_URI,
    state: state,    // it protects against attacks such as cross-site request forgery.
    scope: scope,    // lets us access details about the currently logged-in user's account and their email.
  });

  res.redirect(`https://accounts.spotify.com/authorize?${queryParams}`);
});

/**
 * Set up the /callback route handler
 */


app.get('/callback', (req, res) => {
  const code = req.query.code || null;  //stored the value of our authorization code which we got from the 'code' query param in the 'code' variable.

  // Set up the POST request with axios() method - simpler API(less verbose than Node's built-in modules)
  // Created POST request in our /callback route handler to send the authorization code back to the Spotify server.
  axios({
    method: 'post',
    url: 'https://accounts.spotify.com/api/token',
    data: querystring.stringify({
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: REDIRECT_URI
    }),
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${new Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64')}`,
    },
  })

  //we chain .then() and .catch() callback functions to handle resolving the promise the axios() method returns.
    .then(response => {
      if (response.status === 200) {

        //redirect to my react app
        //pass along access tokens & refresh tokens in query params

        const { access_token, refresh_token, expires_in } = response.data;  //used destructuring to store the access_token, refresh_token and  expires_in as variables to pass into the Authorization header.

        const queryParams = querystring.stringify({
          access_token,
          refresh_token,
          expires_in,
        });

        //redirect to our React app with the access and refresh tokens we received from the Spotify Accounts Service.
        res.redirect(`http://localhost:3000/?${queryParams}`);

      
      } else {
        res.redirect(`/?${querystring.stringify({ error: 'invalid_token' })}`);
      }
    })
    .catch(error => {
      res.send(error);
    });
});


/**
 * Set up the /refresh_token route handler
 */

 app.get('/refresh_token', (req, res) => {
  const { refresh_token } = req.query;

  axios({
    method: 'post',
    url: 'https://accounts.spotify.com/api/token',
    data: querystring.stringify({
      grant_type: 'refresh_token',
      refresh_token: refresh_token
    }),
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${new Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64')}`,
    },
  })
    .then(response => {
      res.send(response.data);
    })
    .catch(error => {
      res.send(error);
    });
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`API running on port ${PORT}`);
});
