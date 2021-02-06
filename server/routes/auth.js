const PORT = process.env.PORT || 8880;
const client_id = process.env.CLIENT_ID;
const client_secret = process.env.CLIENT_SECRET;
const redirect_uri = process.env.REDIRECT_URI;

const express = require("express");
const router = express.Router();

const querystring = require("querystring");
const request = require("request"); // "Request" library

let access_token;
let refresh_token;
let expires_in;
const stateKey = "spotify_auth_state";

const generateRandomString = function (length) {
  var text = "";
  var possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

router.get("/login", function (req, res) {
  console.log("login");
  var state = generateRandomString(16);
  res.cookie(stateKey, state);

  // your application requests authorization
  var scope = `
      streaming  
      user-read-email
      user-read-private 
      user-read-playback-state 
      user-modify-playback-state 
      user-library-read 
      playlist-read-private
      `;
  res.redirect(
    "https://accounts.spotify.com/authorize?" +
      querystring.stringify({
        response_type: "code",
        client_id: client_id,
        scope: scope,
        redirect_uri: redirect_uri,
        state: state,
      })
  );
});

router.get("/callback", function (req, res) {
  // your application requests refresh and access tokens
  // after checking the state parameter
  console.log("callbackings");

  var code = req.query.code || null;
  var state = req.query.state || null;
  var storedState = req.cookies ? req.cookies[stateKey] : null;

  if (state === null || state !== storedState) {
    res.redirect(
      "/#" +
        querystring.stringify({
          error: "state_mismatch",
        })
    );
  } else {
    res.clearCookie(stateKey);
    var authOptions = {
      url: "https://accounts.spotify.com/api/token",
      form: {
        code: code,
        redirect_uri: redirect_uri,
        grant_type: "authorization_code",
      },
      headers: {
        Authorization:
          "Basic " +
          new Buffer(client_id + ":" + client_secret).toString("base64"),
      },
      json: true,
    };

    request.post(authOptions, function (error, response, body) {
      if (!error && response.statusCode === 200) {
        console.log("body.expires_in:", body.expires_in);
        access_token = body.access_token;
        refresh_token = body.refresh_token;
        expires_in = body.expires_in;
        // localStorage.setItem("access_token", JSON.stringify(access_token));
        // localStorage.setItem("refresh_token", JSON.stringify(refresh_token));

        var options = {
          url: "https://api.spotify.com/v1/me",
          headers: { Authorization: "Bearer " + access_token },
          json: true,
        };
        // use the access token to access the Spotify Web API
        request.get(options, function (error, response, body) {
          console.log("get request");
          console.log({ body });
        });

        // we can also pass the token to the browser to make requests from there
        res.redirect(
          "http://localhost:3000/dashboard"
          // "../#" +
          //   querystring.stringify({
          //     access_token: access_token,
          //     refresh_token: refresh_token,
          //   })
        );
      } else {
        res.redirect(
          "/#" +
            querystring.stringify({
              error: "invalid_token",
            })
        );
      }
    });
  }
});

router.get("/refresh_token", function (req, res) {
  // requesting access token from refresh token
  var refresh_token = req.query.refresh_token;
  var authOptions = {
    url: "https://accounts.spotify.com/api/token",
    headers: {
      Authorization:
        "Basic " +
        new Buffer(client_id + ":" + client_secret).toString("base64"),
    },
    form: {
      grant_type: "refresh_token",
      refresh_token: refresh_token,
    },
    json: true,
  };

  request.post(authOptions, function (error, response, body) {
    if (!error && response.statusCode === 200) {
      var access_token = body.access_token;
      res.send({
        access_token: access_token,
      });
    }
  });
});

router.get("/tokens", function (req, res) {
  console.log("GET TOKENS");
  const response = {
    access_token,
    refresh_token,
    expires_in,
  };
  console.log({ response });
  res.send(response);
});

module.exports = router;
