import React from "react";
import { Container } from "react-bootstrap";
const credentials = {
  client_id: "f2623a42d54a4038ac4eb602704e0c1b",
  redirect_uri: "http://localhost:3000/",
};
const AUTH_URL = `https://accounts.spotify.com/authorize?client_id=${credentials.client_id}&response_type=code&redirect_uri=${credentials.redirect_uri}&scope=streaming%20user-read-email%20user-read-private%20user-library-read%20user-library-modify%20user-read-playback-state%20user-modify-playback-state`;
const Login = () => {
  return (
    <Container
      className="d-flex flex-column justify-content-center align-items-center"
      style={{ height: "100vh" }}
    >
      <div className="my-3">Only for <span  className="bg-black text-white rounded px-2 pb-1 ali">Spotify Premium</span> Users</div>
      <a className="btn btn-success btn-lg" href={AUTH_URL}>
        Login with Spotify
      </a>
    </Container>
  );
};
export default Login;
