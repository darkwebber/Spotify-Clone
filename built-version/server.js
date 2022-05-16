require("dotenv").config()
const express = require("express");
const bodyParser = require("body-parser");
const path = require('path');
const SpotifyWebAPI = require("spotify-web-api-node");
const cors = require("cors");
const app = express();
const lyricsFinder = require('lyrics-finder');
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'build')));
app.get('/', function (req, res) {
 res.sendFile(path.join(__dirname, 'build', 'index.html'));
});
app.post("/login", (req, res) => {
  const credentials = {
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    redirectUri: process.env.REDIRECT_URI,
  };
  let code = req.body.code;
  let spotifyApi = new SpotifyWebAPI(credentials);
  spotifyApi
    .authorizationCodeGrant(code)
    .then((data) => {
      spotifyApi.setAccessToken(data.body.access_token);
      spotifyApi.setRefreshToken(data.body.refresh_token);
      res.json({
        accessToken: data.body.access_token,
        refreshToken: data.body.refresh_token,
        expiresIn: data.body.expires_in,
      });
    })
    .catch((err) => {
      //res.redirect("http://localhost:3000/");
    });
});
app.post("/refresh", (req, res) => {
  const refreshToken = req.body.refreshToken;
  const credentials = {
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    redirectUri: process.env.REDIRECT_URI,
    refreshToken: refreshToken,
  };
  let spotifyApi = new SpotifyWebAPI(credentials);
  spotifyApi
    .refreshAccessToken()
    .then((data) => {
      spotifyApi.setAccessToken(data.body.access_token);
      res.json({
        accessToken: data.body.access_token,
        expiresIn: data.body.expires_in,
      });
    })
    .catch((err) => {
      res.status(400);
    });
});
app.get("/lyrics", async (req, res) => {
  const lyrics =
    (await lyricsFinder(req.query.artist, req.query.track)) || "No Lyrics Found"
  res.json({ lyrics })
})
let port = process.env.PORT||3000;

app.listen(port,()=>{
  console.log(`App is live on ${port}`);
});
