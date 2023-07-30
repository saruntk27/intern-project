import "./Navbar.css";

import React, { useEffect, useState } from "react";

import GroupIcon from "@material-ui/icons/Group";
import HomeIcon from "@material-ui/icons/Home";
import InsertDriveFileIcon from "@material-ui/icons/InsertDriveFile";
import { Link } from "react-router-dom";
import PersonIcon from "@material-ui/icons/Person";
import clsx from "clsx";
import { useStateValue } from "../services/StateProvider";

function Navbar() {
  const [{ user }] = useStateValue();
  const isMain = window.location.pathname === "/main";
  const isTeam = window.location.pathname ==="/team";
  const isReport = window.location.pathname ==="/report";
  const isMember = window.location.pathname ==="/member";

  return (
    <div className="navbar">
      {user !== null ? (
        <div className="navbarInfo">
          <div className="navbarRow">
            <p style={{ marginLeft: "40px" }}>NAVIGATION</p>
          </div>

          {user.role === "Master" ? (
            <>
              <Link
                to="/main"
                style={{
                  color: "inherit",
                  textDecoration: "",
                  marginTop: "7px",
                }}
                className="underLineNone"
              >
                <div
                  className={clsx({
                    navbarItem: !isMain,
                    "navbarItem active": isMain,
                  })}
                >
                  <div className="flex">
                    <HomeIcon className="navbarIcon"></HomeIcon>
                    <p
                      className={clsx({
                        navText: !isMain,
                        navTextActive: isMain,
                      })}
                    >
                      Dashboard
                    </p>
                  </div>
                </div>
              </Link>

              <Link
                to="/member"
                style={{ color: "inherit", textDecoration: "" }}
                className="underLineNone"
              >
                <div
                  className={clsx({
                    navbarItem: !isMember,
                    "navbarItem active": isMember,
                  })}
                >
                  <div className="flex">
                    <PersonIcon className="navbarIcon"></PersonIcon>
                    <p
                      className={clsx({
                        navText: !isMember,
                        navTextActive: isMember,
                      })}
                    >
                      Member
                    </p>
                  </div>
                </div>
              </Link>

              <Link
                to="/team"
                style={{ color: "inherit", textDecoration: "" }}
                className="underLineNone"
              >
                <div
                  className={clsx({
                    navbarItem: !isTeam,
                    "navbarItem active": isTeam,
                  })}
                >
                  <div className="flex">
                    <GroupIcon className="navbarIcon"></GroupIcon>
                    <p
                      className={clsx({
                        navText: !isTeam,
                        navTextActive: isTeam,
                      })}
                    >
                      Team
                    </p>
                  </div>
                </div>
              </Link>
            </>
          ) : null}

          <Link
            style={{ color: "inherit", textDecoration: "inherit" }}
            onClick={() => {
              window.location.href = "/report";
            }}
          >
            <div
              className={clsx({
                navbarItem: !isReport,
                "navbarItem active": isReport,
              })}
              style={user.role !== "Master" ? { marginTop: 7 } : null}
            >
              <div className="flex">
                <InsertDriveFileIcon className="navbarIcon"></InsertDriveFileIcon>
                <p
                  className={clsx({
                    navText: !isReport,
                    navTextActive: isReport,
                  })}
                >
                  Report
                </p>
              </div>
            </div>
          </Link>
        </div>
      ) : null}
    </div>
  );
}

export default Navbar;
