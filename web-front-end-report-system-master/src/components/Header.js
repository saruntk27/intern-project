import React, { useEffect, useState, useRef } from "react";
import { useStateValue } from "../services/StateProvider";
import AuthAxios from "../services/AuthAxios";
import { actionTypes } from "../services/reducer";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import MenuIcon from "@material-ui/icons/Menu";
import { Link } from "react-router-dom";
import "./Header.css";
import CloseIcon from "@material-ui/icons/Close";
import HomeIcon from "@material-ui/icons/Home";
import PersonIcon from "@material-ui/icons/Person";
import InsertDriveFileIcon from "@material-ui/icons/InsertDriveFile";
import GroupIcon from "@material-ui/icons/Group";
import firebase from "../../src/firebase";
import NotificationsActiveIcon from "@material-ui/icons/NotificationsActive";
import { Avatar } from "@material-ui/core";
import NotificationRow from "./NotificationRow";

function useOnClickOutside(ref, handler) {
  useEffect(() => {
    const listener = (event) => {
      if (!ref.current || ref.current.contains(event.target)) {
        return;
      }

      handler(event);
    };

    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);

    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [ref, handler]);
}

function Header({ showMenuCallback, closeMenuCallback }) {
  const [{ user }, dispatch] = useStateValue();
  const id = localStorage.getItem("id");
  const token = localStorage.getItem("token");
  const [showMenu, setShowMenu] = useState(false);
  const [memberNotifications, setMemberNotifications] = useState([]);
  const [memberNotificationsLength, setMemberNotificationsLength] = useState(0);
  const [allNotiCount, setAllNotiCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [update, setUpdate] = useState(false);

  useEffect(() => {
    fetchAuthUser();
    // getToken();
    fetchNotifications();
  }, [id, token, update]);

  useEffect(() => {
    checkUser();
  }, []);

  const [resize, setResize] = useState(false);
  const resizeFunction = () => {
    if (window.innerWidth <= 500) {
      setResize(true);
    } else {
      closeMenuCallback();
      setShowMenu(false);
      setResize(false);
    }
  };
  useEffect(() => {
    resizeFunction();
  }, []);
  window.addEventListener("resize", resizeFunction);

  const fetchAuthUser = async () => {
    await AuthAxios(token)
      .get("/login/auth")
      .then((res) => {
        if (res.data.name === "TokenExpiredError") {
          dispatch({
            type: actionTypes.SET_USER,
            user: null,
            jwt: null,
          });
          alert("Token expired");
          window.location = "/";
        } else {
          if (res.data.error) {
            alert(res.data.error);
            window.location = "/";
          } else {
            dispatch({
              type: actionTypes.SET_USER,
              user: res.data,
              jwt: token,
            });
          }
        }
      })
      .catch((err) => console.log(err));
  };

  const getToken = async () => {
    let messaging = null;
    if (firebase.messaging.isSupported()) {
      messaging = firebase.messaging();
      let fcm = "";
      await messaging
        .requestPermission()
        .then(() => {
          return messaging.getToken();
        })
        .then((token) => {
          console.log(token);
          fcm = token;
        })
        .catch((err) => {
          console.log(err);
        });
      const userUpdate = {
        fcm: fcm,
      };
      await AuthAxios(token)
        .post("/user/update/" + id, userUpdate)
        .catch((err) => console.log(err));
      messaging.onMessage(function (payload) {
        console.log(payload);
      });
    } else {
      console.log("Safari not yet supported firebase Messaging");
    }
  };

  const fetchNotifications = async () => {
    setLoading(true);
    await AuthAxios(token)
      .get(`/notification/report/user/${id}`)
      .then((res) => {
        if (res.data.name === "TokenExpiredError") {
          alert("Token expired");
          window.location = "/";
        } else {
          setMemberNotifications(res.data);
          let sum = 0;
          for (let i = 0; i < res.data.length; i++) {
            if (res.data[i].notification.isRead === false) {
              sum++;
            }
          }
          setMemberNotificationsLength(sum);
          setAllNotiCount(res.data.length)
          setLoading(false);
        }
      })
      .catch((err) => console.log(err));
  };

  const handleShowMenu = (e) => {
    e.preventDefault();
    showMenuCallback();
    setShowMenu(true);
  };

  const handleCloseMenu = () => {
    closeMenuCallback();
    setShowMenu(false);
  };

  const handleCloseMenuReportPage = () => {
    closeMenuCallback();
    setShowMenu(false);
    window.location.href = "/report";
  };

  const [notification, setNotification] = useState(false);
  const refNotification = useRef();
  useOnClickOutside(refNotification, () => {
    setNotification(false);
  });

  const handleNotification = (e) => {
    e.preventDefault();
    setNotification(true);
  };

  const handleExit = () => {
    dispatch({
      type: actionTypes.SET_USER,
      user: null,
      jwt: null,
    });
    window.localStorage.removeItem("token");
    window.localStorage.removeItem("id");
    window.location = "/";
  };

  const checkUser = () => {
    if (localStorage.getItem("id") === null) {
      alert("Please login again");
      window.location = "/";
    }
  };

  const clearNoti = (e) => {
    e.preventDefault();
    console.log("Clear");
    deleteAllNoti()
    fetchNotifications()
  };

  const deleteAllNoti = async () => {
    await AuthAxios(token)
      .delete("/notification")
      .then((res) => {
        alert(res.data);
        window.location.reload(false);
      })
      .catch((err) => console.log(err));
  };

  return (
    <>
      <div className="header">
        <div className="headerRow">
          <img
            className="headerLogo"
            alt=""
            src="/eiloy_logo_white.png"
            style={{ height: 80, width: 80, marginLeft: 8 }}
          ></img>
          <p className="headerTitle" style={{ color: "white", marginTop: 8 }}>
            Eiloy Daily Report
          </p>
        </div>

        <div className="headerRow">
          <div className="headerInfo">
            {user !== null ? (
              <>
                <p>{user.username}</p>
                <span>{user.role}</span>
              </>
            ) : (
              <>
                <p>Loading...</p>
                <span>Loading...</span>
              </>
            )}
          </div>
          {user !== null ? (
            <>
              {user.profile !== "" ? (
                <img
                  src={`${process.env.REACT_APP_URL}/${user.profile}`}
                  alt="Avatar"
                  className="avatar"
                  style={{ margin: "15px" }}
                ></img>
              ) : (
                <img
                  src={`/img_avatar.png`}
                  alt="Avatar"
                  className="avatar"
                  style={{ margin: "15px" }}
                ></img>
              )}
              <div className="iconNotification" onClick={handleNotification}>
                <NotificationsActiveIcon
                  className={"icon"}
                  style={{ fontSize: "30px", marginRight: 15 }}
                ></NotificationsActiveIcon>
                {memberNotificationsLength !== 0 ? (
                  <p style={{ color: "white" }}>{memberNotificationsLength}</p>
                ) : null}
                {notification ? (
                  <div
                    className="dropdown"
                    ref={refNotification}
                    style={{ width: "330px" }}
                  >
                    <div className="dropdown__notificationInfo">
                      <p style={{ marginTop: "20px", marginLeft: "1em" }}>
                        การแจ้งเตือน
                      </p>
                      {allNotiCount !== 0 ? (
                        <p onClick={clearNoti} style={{ marginTop: "20px", marginRight: "1em", cursor: "pointer" }}>
                          Delete all
                        </p>
                      ) : null}
                    </div>
                    <div className="dropdownDividerContainer">
                      <div className="dropdownDivider"></div>
                    </div>
                    {memberNotifications[0] !== undefined ? (
                      <div className="memberNotificationWrapper">
                        {memberNotifications.map((memberNotification) => (
                          <NotificationRow
                            memberNotification={memberNotification}
                            handleUpdate={() => setUpdate(!update)}
                          />
                        ))}
                      </div>
                    ) : (
                      <>
                        {loading ? (
                          <p
                            style={{
                              marginTop: "5px",
                              marginLeft: "1em",
                              marginBottom: "20px",
                            }}
                          >
                            Loading...
                          </p>
                        ) : (
                          <p
                            style={{
                              marginTop: "5px",
                              marginLeft: "1em",
                              marginBottom: "20px",
                            }}
                          >
                            คุณยังไม่มีแจ้งเตือนในขณะนี้
                          </p>
                        )}
                      </>
                    )}
                  </div>
                ) : (
                  <></>
                )}
              </div>
            </>
          ) : (
            <>
              {resize ? (
                <img
                  src={`/img_avatar.png`}
                  alt="Avatar"
                  className="avatar"
                  style={{ margin: "15px", width: 40, height: 40 }}
                ></img>
              ) : (
                <img
                  src={`/loading_avatar.png`}
                  alt="Avatar"
                  className="avatar"
                  style={{ margin: "15px", width: 40, height: 40 }}
                ></img>
              )}
            </>
          )}

          {resize ? (
            <>
              {showMenu ? (
                <>
                  <CloseIcon
                    className="icon"
                    style={{ fontSize: "30px" }}
                    onClick={handleCloseMenu}
                  ></CloseIcon>
                </>
              ) : (
                <MenuIcon
                  className="icon"
                  style={{ fontSize: "30px" }}
                  onClick={handleShowMenu}
                />
              )}
            </>
          ) : (
            <div className="header__logout">
              <ExitToAppIcon
                className="icon"
                style={{ fontSize: "30px" }}
                onClick={handleExit}
              />
            </div>
          )}
        </div>
      </div>
      {showMenu ? (
        <div className="header__menu">
          {user !== null ? (
            <>
              <div className="header__navbarTitle">
                <p>NAVIGATION</p>
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
                    onClick={handleCloseMenu}
                  >
                    <div className="header__navbarItem">
                      <HomeIcon className="header__navbarIcon" />
                      <div>Dashboard</div>
                    </div>
                  </Link>
                  <Link
                    to="/member"
                    style={{
                      color: "inherit",
                      textDecoration: "",
                    }}
                    className="underLineNone"
                    onClick={handleCloseMenu}
                  >
                    <div className="header__navbarItem">
                      <PersonIcon className="header__navbarIcon" />
                      <div>Member</div>
                    </div>
                  </Link>
                  <Link
                    to="/team"
                    style={{
                      color: "inherit",
                      textDecoration: "",
                    }}
                    className="underLineNone"
                    onClick={handleCloseMenu}
                  >
                    <div className="header__navbarItem">
                      <GroupIcon className="header__navbarIcon" />
                      <div>Team</div>
                    </div>
                  </Link>
                </>
              ) : null}
              <Link
                to="/report"
                style={{
                  color: "inherit",
                  textDecoration: "",
                }}
                className="underLineNone"
                onClick={handleCloseMenuReportPage}
              >
                <div className="header__navbarItem">
                  <InsertDriveFileIcon className="header__navbarIcon" />
                  <div>Report</div>
                </div>
              </Link>
              <Link
                style={{
                  color: "inherit",
                  textDecoration: "",
                }}
                className="underLineNone"
                onClick={handleExit}
              >
                <div className="header__navbarItem">
                  <ExitToAppIcon className="header__navbarIcon" />
                  <div>Logout</div>
                </div>
              </Link>
            </>
          ) : null}
        </div>
      ) : null}
    </>
  );
}

export default Header;
