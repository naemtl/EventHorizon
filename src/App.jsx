import React, { Component } from "react";
import Login from "./Login.jsx";
import Signup from "./Signup.jsx";

class App extends Component {
  render = () => {
    return (
      <div>
        <Login />
        <Signup />
      </div>
    );
  };
}

export default App;
