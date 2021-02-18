import React, { useState, useHistory } from "react";
import axios from "axios";

export default class Login extends React.Component {
  // const [name, setName] = useState('');
  // const [password, setPassword] = useState('');

  render() {
    return (
      <div>
        <a href="http://localhost:3001/authors/googleLogin">
          <button>Sign in with Google!</button>
        </a>
      </div>
    );
  }
}

//export default Login;
