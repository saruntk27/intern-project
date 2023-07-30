import React, { useEffect, useState } from "react";
import {
  BrowserRouter,
  BrowserRouter as Router,
  Route,
  Switch,
} from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Login from "./pages/LoginPage/Login";
import "./css/globalStyle.css";
import Header from "./components/Header";
import Navbar from "./components/Navbar";
import "./css/Main.css";
import Report from "./pages/ReportPage/Reports";
import Member from "./pages/Member/Member";
import Team from "./pages/Team/Team";
import Dashboard from "./pages/DashboardPage/Dashboard";
import ReactNotifications from "react-notifications-component";

function App() {
  const AppRoute = (props) => {
    const { component: Component, hasNavBar } = props;
    const [resize, setComponent] = useState(true);
    const [showMenu, setShowMenu] = useState(false);

    const resizeFunction = () => {
      if (window.innerWidth <= 500) {
        setComponent(false);
      } else {
        setComponent(true);
      }
    };
    useEffect(() => {
      resizeFunction();
    }, []);
    window.addEventListener("resize", resizeFunction);

    const showMenuCallback = () => {
      setShowMenu(true);
    };

    const closeMenuCallback = () => {
      setShowMenu(false);
    };

    return (
      <>
        {hasNavBar ? (
          <div className="mainContainer">
            <Header
              showMenuCallback={showMenuCallback}
              closeMenuCallback={closeMenuCallback}
            ></Header>
            <div className="mainBody">
              <ReactNotifications />
              {!resize ? null : <Navbar></Navbar>}
              <div
                className="content"
                style={showMenu ? { display: "none" } : null}
              >
                <Route
                  {...props}
                  render={(props) => <Component {...props} />}
                />
              </div>
            </div>
          </div>
        ) : (
          <Route {...props} render={(props) => <Component {...props} />} />
        )}
      </>
    );
  };

  return (
    <BrowserRouter>
      <Switch>
        <AppRoute path="/" exact component={Login} />
        <AppRoute path="/main" component={Dashboard} hasNavBar />
        <AppRoute path="/team" component={Team} hasNavBar />
        <AppRoute path="/member" exact component={Member} hasNavBar />
        <AppRoute path="/report" component={Report} hasNavBar />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
