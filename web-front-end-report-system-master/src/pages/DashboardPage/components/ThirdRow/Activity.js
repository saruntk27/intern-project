import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import { Divider } from "@material-ui/core";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";
import moment from "moment";
import AuthAxios from "../../../../services/AuthAxios";
import TokenExpired from "../../../../services/TokenExpired";
import { useStateValue } from "../../../../services/StateProvider";

const useStyles = makeStyles({
  root: {
    width: 1081,
    height: 445,
    background: `#FFFFFF`,
    boxShadow: "0px 3px 6px #00000029",
    borderRadius: 20,
    opacity: 1,
    marginBottom: 30,
    padding: "5px 25px 0px 25px",
  },
  rootResize: {
    width: 378,
    height: 445,
    background: `#FFFFFF`,
    boxShadow: "0px 3px 6px #00000029",
    borderRadius: 20,
    opacity: 1,
    marginBottom: 30,
    padding: "5px 25px 0px 25px",
  },
  title: {
    fontSize: 28,
    fontWeight: "400",
    color: "#000000",
    opacity: 0.87,
  },
  titleResize: {
    display: "flex",
    justifyContent: "center",
    fontSize: 28,
    fontWeight: "400",
    color: "#000000",
    opacity: 0.87,
  },
  fontColor: {
    color: "#000000",
  },
  body: {
    marginTop: "13px",
    display: "flex",
    flexDirection: "column",
    flex: 1,
    marginBottom: "15px",
    justifyContent: "center",
    textAlign: "center",
    height: "auto",
  },
  activity: {
    display: "flex",
    height: 80,
    width: "100%",
  },
  noActivity: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: 270,
    width: "100%",
    fontSize: 20,
    opacity: 0.8
  },
  first: {
    display: "flex",
    alignItems: "center",
    flex: 0.1,
  },
  second: {
    display: "flex",
    alignItems: "center",
    flex: 0.15,
  },
  third: {
    display: "flex",
    alignItems: "center",
    flex: 0.2,
  },
  fourth: {
    display: "flex",
    alignItems: "center",
    flex: 0.4,
  },
  fifth: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    flex: 0.15,
  },
  midTitle: {
    fontWeight: 500,
    display: "flex",
    justifyContent: "flext-start",
    opacity: 0.87,
    fontSize: 16,
  },
  subText: {
    opacity: 0.87,
    color: "#707070",
    fontSize: 14,
  },
  rightText: {
    opacity: 0.87,
    fontSize: 16,
    color: "#1A4074",
    fontWeight: 500,
  },
});
function Activity(props) {
  const [{ user, jwt }] = useStateValue();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const classes = useStyles();

  useEffect(() => {
    if (user !== null) {
      if (user.role === "Master") {
        fetchActivity();
      }
    }
  }, [jwt]);

  const fetchActivity = async () => {
    setLoading(true);
    await AuthAxios(jwt)
      .get(`/notification/dashboard`)
      .then((res) => {
        try {
          if (res.data.name === "TokenExpiredError") {
            TokenExpired();
          } else {
            setNotifications(res.data);
            setLoading(false);
          }
        } catch (e) {
          console.log(e);
        }
      });
  };

  const [resize, setResize] = useState(false);
  const resizeFunction = () => {
    if (window.innerWidth <= 500) {
      setResize(true);
    } else {
      setResize(false);
    }
  };
  useEffect(() => {
    resizeFunction();
  }, []);
  window.addEventListener("resize", resizeFunction);

  return (
    <Card className={resize ? classes.rootResize : classes.root}>
      <CardContent>
        <Typography
          className={resize ? classes.titleResize : classes.title}
          color="textSecondary"
          gutterBottom
        >
          {props.title}
        </Typography>
        <Typography variant="h5" component="h2" className={classes.body}>
          {loading ? (
            <p className={classes.noActivity}>Loading...</p>
          ) : (
            <>
              {notifications.length === 0 ? (
                <p className={classes.noActivity}>Don't have any activities</p>
              ) : (
                <>
                  {notifications.map((notification, index) => (
                    <>
                      <div className={classes.activity}>
                        {!resize && (
                          <>
                            <div className={classes.first}>
                              <img
                                src={
                                  notification.profile !== ""
                                    ? `${process.env.REACT_APP_URL}/${notification.profile}`
                                    : `/img_avatar.png`
                                }
                                alt="Avatar"
                                className="avatar"
                                style={{ width: 48, height: 48 }}
                              ></img>
                            </div>
                            <div className={classes.second}>
                              <p className={classes.rightText}>
                                {notification.teamname}
                              </p>
                            </div>
                          </>
                        )}
                        <div className={classes.third}>
                          <p className={classes.midTitle}>
                            {notification.leadername}
                          </p>
                        </div>
                        <div
                          className={classes.fourth}
                          style={resize ? { flex: 1 } : { flex: 0.4 }}
                        >
                          <p className={classes.subText}>
                            {notification.notification.description}
                          </p>
                          <ArrowForwardIcon
                            style={
                              resize
                                ? { opacity: 0.7, marginRight: "10px" }
                                : { opacity: 0.7, margin: "0px 10px" }
                            }
                          />
                          <p className={classes.subText}>
                            {notification.notification.username}
                          </p>
                        </div>
                        {!resize && (
                          <div className={classes.fifth}>
                            <p className={classes.subText}>
                              {moment(
                                new Date(notification.notification.createdAt)
                              )
                                .startOf("minute")
                                .fromNow()}
                            </p>
                          </div>
                        )}
                      </div>
                      {index === 3 ? null : <Divider />}
                    </>
                  ))}
                </>
              )}
            </>
          )}
        </Typography>
      </CardContent>
    </Card>
  );
}

export default Activity;
