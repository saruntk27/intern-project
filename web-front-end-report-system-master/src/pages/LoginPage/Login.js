import "./css/Login.css";

import React, { useEffect, useState } from "react";

import PersonIcon from "@material-ui/icons/Person";
import { Spinner } from "react-bootstrap";
import VisibilityIcon from "@material-ui/icons/Visibility";
import axios from "axios";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setloading] = useState(false);

  useEffect(() => {
    const listener = (event) => {
      if (event.code === "Enter" || event.code === "NumpadEnter") {
        event.preventDefault();
        validation();
      }
    };
    document.addEventListener("keydown", listener);
    return () => {
      document.removeEventListener("keydown", listener);
    };
  }, [username, password]);

  const submit = (e) => {
    e.preventDefault();
    validation();
  };

  const validation = async () => {
    let isUserCorrect = false;
    let isPasswordCorrect = false;

    //validate user
    if (username.length >= 1 || username === "admin") {
      isUserCorrect = true;
    } else {
      alert("username ต้อง มากกว่า 6 ตัวขึ้นไป");
    }

    //validate password
    if (password.length >= 1 || password === "admin") {
      isPasswordCorrect = true;
    } else {
      alert("password ต้อง มากกว่า 8 ตัวขึ้นไป");
    }

    //all correct then send user to back-end
    if (isUserCorrect && isPasswordCorrect) {
      setloading(true);
      const user = {
        username,
        password,
      };
      let responseUser = {};
      await axios
        .post(process.env.REACT_APP_URL + "/login", user)
        .then((res) => {
          if (res.data.error) {
            alert(res.data.error);
            setloading(false);
          } else {
            responseUser = res.data.user;
            window.localStorage.token = res.data.token;
            window.localStorage.id = res.data.user._id;
            if (responseUser.role === "Master") {
              setloading(false);
              window.location = "/main";
            } else {
              setloading(false);
              window.location = "/report";
            }
          }
        })
        .catch((error) => console.log(error));
    }

    resetInput();
  };

  const resetInput = () => {
    setUsername("");
    setPassword("");
  };

  return (
    <div className="loginwrapper">
      <div className="center">
        <div className="login">
          <img className="logo" alt="" src="/eiloy_logo_white_text.png"></img>
          <h3 className="label">Login</h3>
          <div className="loginForm">
            <div className="form" style={{ margin: "30px 0px" }}>
              <input
                id="username"
                className="formlogin"
                type="text"
                placeholder="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              ></input>
              <PersonIcon className="icon"></PersonIcon>
            </div>
            <div className="form">
              <input
                id="password"
                className="formlogin"
                type="password"
                placeholder="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              ></input>
              <VisibilityIcon className="icon"></VisibilityIcon>
            </div>
            <div>
              <button type="button" className="loginbtn" onClick={submit}>
                {loading ? (
                  <>
                    <Spinner
                      as="span"
                      animation="grow"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                      style={{ marginRight: "10px", marginTop: 2 }}
                    />
                    <p style={{ fontSize: 20 }}>Loading...</p>
                  </>
                ) : (
                  <p className="LoginText">Login</p>
                )}
              </button>
            </div>
          </div>
        </div>
        <div style={{ height: "100px" }}></div>
      </div>
    </div>
  );
}

export default Login;
