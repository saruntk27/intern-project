import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import { Divider } from "@material-ui/core";
import AuthAxios from "../../../../services/AuthAxios";
import TokenExpired from "../../../../services/TokenExpired";
import { useStateValue } from "../../../../services/StateProvider";

const useStyles = makeStyles({
  noActivity: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: 270,
    width: "100%",
    fontSize: 20,
    opacity: 0.8,
  },
  root: {
    width: 480,
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
    marginTop: "20px",
    display: "flex",
    flexDirection: "column",
    flex: 1,
    marginBottom: "15px",
    justifyContent: "center",
    textAlign: "center",
    height: "auto",
  },
  team: {
    display: "flex",
    height: 100,
    width: "100%",
    paddingTop: 9,
  },
  teamLeft: {
    display: "flex",
    flex: 0.2,
  },
  teamMid: {
    display: "flex",
    flexDirection: "column",
    flex: 0.5,
  },
  midText: {
    fontWeight: 500,
    display: "flex",
    justifyContent: "flext-start",
    opacity: 0.87,
    fontSize: 16,
  },
  midSubText: {
    display: "flex",
    justifyContent: "flext-start",
    opacity: 0.87,
    color: "#707070",
    fontSize: 14,
  },
  teamRight: {
    textAlign: "end",
    flex: 0.3,
  },
  rightText: {
    opacity: 0.87,
    fontSize: 16,
    color: "#1A4074",
    fontWeight: 500,
  },
});

function TeamLeader(props) {
  const [{ user, jwt }] = useStateValue();
  const [team, setTeam] = useState([]);
  const classes = useStyles();
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    if (user !== null) {
      if (user.role === "Master") {
        fetchTeamsLeader();
      }
    }
  }, [jwt]);

  const fetchTeamsLeader = async () => {
    setLoading(true);
    await AuthAxios(jwt)
      .get(`/dashboard/teams/leader`)
      .then((res) => {
        try {
          if (res.data.name === "TokenExpiredError") {
            TokenExpired();
          } else {
            setTeam(res.data);
            setLoading(false);
          }
        } catch (e) {
          console.log(e);
        }
      });
  };

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
              {team.length === 0 ? (
                <p className={classes.noActivity}>Don't have any teams</p>
              ) : (
                <>
                  {team.map((teamLeader, i) => (
                    <>
                      {i === 0 ? null : (
                        <Divider style={{ marginBottom: 18 }} />
                      )}
                      <div className={classes.team}>
                        <div className={classes.teamLeft}>
                          <img
                            src={
                              teamLeader.leader.profile !== ""
                                ? `${process.env.REACT_APP_URL}/${teamLeader.leader.profile}`
                                : `/img_avatar.png`
                            }
                            alt="Avatar"
                            className="avatar"
                            style={{ width: 48, height: 48 }}
                          ></img>
                        </div>
                        <div className={classes.teamMid}>
                          <p className={classes.midText}>
                            {teamLeader.leader.username}
                          </p>
                          <p className={classes.midSubText}>
                            {teamLeader.leader.email}
                          </p>
                          <p className={classes.midSubText}>
                            {teamLeader.leader.phone}
                          </p>
                        </div>
                        <div className={classes.teamRight}>
                          <p className={classes.rightText}>
                            {teamLeader.teamname}
                          </p>
                        </div>
                      </div>
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

export default TeamLeader;
