const express = require("express");
const bodyParser = require("body-parser");
const SpotifyWebAPI = require("spotify-web-api-node");
const cors = require("cors");
const app = express();
const lyricsFinder = require('lyrics-finder');
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.post("/login", (req, res) => {
  const credentials = {
    clientId: "f2623a42d54a4038ac4eb602704e0c1b",
    clientSecret: "61fbfe1c0bdf47e58541ff8f2cee15c3",
    redirectUri: "http://localhost:3000/",
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
    clientId: "f2623a42d54a4038ac4eb602704e0c1b",
    clientSecret: "61fbfe1c0bdf47e58541ff8f2cee15c3",
    redirectUri: "http://localhost:3000/",
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


app.listen(3001);
