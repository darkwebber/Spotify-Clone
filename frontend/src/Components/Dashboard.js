import React from "react";
import { useState, useEffect } from "react";
import useAuth from "../Hooks/useAuth";
import TrackSearchResult from "./TrackSearchResult";
import { Container, Form } from "react-bootstrap";
import SpotifyWebApi from "spotify-web-api-node";
import Player from "./Player";
import axios from "axios";
const Dashboard = ({ code }) => {
  let player = <p></p>;
  let accessToken = useAuth(code);
  let spotifyApi = new SpotifyWebApi({
    clientId: "f2623a42d54a4038ac4eb602704e0c1b",
  });
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [playingTrack, setPlayingTrack] = useState("");
  const [lyrics, setLyrics] = useState("");

  const chooseTrack = (track) => {
    setPlayingTrack(track);
    setSearch("");
    setLyrics("");
  };
  useEffect(() => {
    if (!playingTrack) return;

    axios
      .get("http://localhost:3001/lyrics", {
        params: {
          track: playingTrack.title,
          artist: playingTrack.artist,
        },
      })
      .then((res) => {
        setLyrics(res.data.lyrics);
      });
  }, [playingTrack]);

  useEffect(() => {
    if (!search) return setSearchResults([]);
    if (!accessToken) return;
    spotifyApi.setAccessToken(accessToken);
    const minFind = (arr) => {
      let count = 0,
        ind = 0,
        min = arr[0].height;
      arr.forEach((ele) => {
        if (ele.height < min) {
          min = ele.height;
          ind = count;
        }
        count++;
      });
      return arr[ind].url;
    };
    let cancel = false;
    spotifyApi
      .searchTracks(search)
      .then((res) => {
        if (cancel) return;
        setSearchResults(
          res.body.tracks.items.map((item) => {
            return {
              artists: item.artists.map((artist) => {
                return artist.name;
              }),
              title: item.name,
              uri: item.uri,
              Albumuri: minFind(item.album.images),
            };
          })
        );
        
      })
      .catch((err) => {
        console.log(err);
      });
    return () => (cancel = true);
  }, [search, accessToken]);

  return (
    <Container className="d-flex flex-column py-2" style={{ height: "100vh" }}>
      <Form.Control
        type="search"
        placeholder="Search Songs/Artists"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <div className="flex-grow-1 my-2" style={{ overflowY: "auto" }}>
        {searchResults.map((track) => {
          return (
            <TrackSearchResult
              track={track}
              key={track.uri}
              chooseTrack={chooseTrack}
            />
          );
        })}
        {searchResults == 0 && (
          <div className="text-center" style={{ whiteSpace: "pre" }}>
            {lyrics}
          </div>
        )}
      </div>
      <div>
        {player}
        {accessToken ? (
          <Player
            accessToken={accessToken}
            trackUri={playingTrack != "" ? playingTrack.uri : ""}
          />
        ) : (
          player
        )}
      </div>
    </Container>
  );
};
export default Dashboard;
