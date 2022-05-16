import React from "react";
import Login from "./Login";
import "bootstrap/dist/css/bootstrap.css";
import Dashboard from "./Dashboard";
let code = new URLSearchParams(window.location.search).get("code");
const App = () => {
  return code ? <Dashboard code={code} /> : <Login />;
};

export default App;
