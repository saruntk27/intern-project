import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import clsx from "clsx";
import { Chart } from "react-charts";
import AuthAxios from "../../../../services/AuthAxios";
import TokenExpired from "../../../../services/TokenExpired";
import { useStateValue } from "../../../../services/StateProvider";

const useStyles = makeStyles({
  root: {
    width: 786,
    height: 361,
    background: "#FFFFFF 0% 0% no-repeat padding-box",
    boxShadow: "0px 3px 6px #00000029",
    borderRadius: 20,
    opacity: 1,
    marginBottom: 30,
    padding: "5px 25px 0px 25px",
  },
  rootResize: {
    width: 378,
    height: "auto",
    background: "#FFFFFF 0% 0% no-repeat padding-box",
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
    fontSize: 23,
    fontWeight: "400",
    color: "#000000",
    opacity: 0.87,
    marginBottom: 20,
  },
  body: {
    display: "flex",
    marginBottom: "15px",
    height: "auto",
  },
  bodyResize: {
    display: "flex",
    flexDirection: "column",
    marginBottom: "15px",
    height: "auto",
  },
  body_left: {
    display: "flex",
    flex: 0.7,
    alignItems: "center",
  },
  body_leftResize: {
    display: "flex",
    width: "100%",
    height: 242,
    alignItems: "center",
  },
  body_right: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "flex-end",
    textAlign: "right",
    flex: 0.3,
    fontSize: 20,
  },
  addTitle: {
    color: "#0079B6",
    fontSize: 64,
    fontWeight: "bold",
  },
  delTitle: {
    marginTop: 20,
    color: "#00B7DA",
    fontSize: 64,
    fontWeight: "bold",
  },
});

function AddDel(props) {
  const [{ user, jwt }] = useStateValue();
  const classes = useStyles();
  const [resize, setResize] = useState(false);
  const [totalAdditions, setTotalAdditions] = useState(0);
  const [totalDeletetions, setTotalDeletetions] = useState(0);
  const [currentMonthAdditions, setCurrentMonthAdditions] = useState(0);
  const [currentMonthdeletions, setCurrentMonthdeletions] = useState(0);
  const [oneMonthAgoAdditions, setOneMonthAgoAdditions] = useState(0);
  const [oneMonthAgoDeletions, setOneMonthAgoDeletions] = useState(0);
  const [twoMonthAgoAdditions, setTwoMonthAgoAdditions] = useState(0);
  const [twoMonthAgoDeletions, setTwoMonthAgoDeletions] = useState(0);

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

  const data = React.useMemo(
    () => [
      {
        label: "Additions",
        data: [
          ["2 months ago", twoMonthAgoAdditions],
          ["1 month ago", oneMonthAgoAdditions],
          ["current month", currentMonthAdditions],
        ],
        color: "#1f77b4",
      },
      {
        label: "Deletions",
        data: [
          ["2 months ago", twoMonthAgoDeletions],
          ["1 month ago", oneMonthAgoDeletions],
          ["current month", currentMonthdeletions],
        ],
        color: "#00B7DA",
      },
    ],
    [
      twoMonthAgoAdditions,
      oneMonthAgoAdditions,
      currentMonthAdditions,
      twoMonthAgoDeletions,
      oneMonthAgoDeletions,
      currentMonthdeletions,
    ]
  );

  const series = React.useMemo(
    () => ({
      type: "bar",
    }),
    []
  );

  const axes = React.useMemo(
    () => [
      { primary: true, type: "ordinal", position: "bottom" },
      { position: "left", type: "linear", stacked: false },
    ],
    []
  );

  useEffect(() => {
    if (user !== null) {
      if (user.role === "Master") {
        fetchTotalStatus();
        fetchStatusThreeMonthAgo();
      }
    }
  }, [jwt]);

  const fetchTotalStatus = async () => {
    await AuthAxios(jwt)
      .get(`/dashboard/report/status/count`)
      .then((res) => {
        try {
          if (res.data.name === "TokenExpiredError") {
            TokenExpired();
          } else {
            setTotalAdditions(convertToK(res.data.totalAdditions));
            setTotalDeletetions(convertToK(res.data.totalDeletetions));
          }
        } catch (e) {
          console.log(e);
        }
      });
  };

  const convertToK = (value) => {
    if (value >= 1000000) {
      return (value / 1000000).toFixed(2) + "M";
    }
    if (value >= 100000) {
      return (value / 1000).toFixed(2) + "k";
    } else {
      return value;
    }
  };

  const fetchStatusThreeMonthAgo = async () => {
    await AuthAxios(jwt)
      .get(`/dashboard/report/status/threemonthago/count`)
      .then((res) => {
        try {
          if (res.data.name === "TokenExpiredError") {
            TokenExpired();
          } else {
            setCurrentMonthAdditions(res.data.currentMonthAdditions);
            setCurrentMonthdeletions(res.data.currentMonthdeletions);
            setOneMonthAgoAdditions(res.data.oneMonthAgoAdditions);
            setOneMonthAgoDeletions(res.data.oneMonthAgoDeletions);
            setTwoMonthAgoAdditions(res.data.twoMonthAgoAdditions);
            setTwoMonthAgoDeletions(res.data.twoMonthAgoDeletions);
          }
        } catch (e) {
          console.log(e);
        }
      });
  };

  return (
    <Card className={resize ? clsx(classes.rootResize) : clsx(classes.root)}>
      <CardContent>
        <Typography
          className={clsx(
            resize ? clsx(classes.titleResize) : clsx(classes.title)
          )}
          color="textSecondary"
          gutterBottom
        >
          Additions and Deletions
        </Typography>
        <Typography
          variant="h5"
          component="h2"
          className={resize ? clsx(classes.bodyResize) : clsx(classes.body)}
        >
          <Typography
            variant="h5"
            component="h2"
            className={
              resize ? clsx(classes.body_leftResize) : clsx(classes.body_left)
            }
          >
            <Chart data={data} series={series} axes={axes} tooltip />
          </Typography>
          <Typography
            variant="h5"
            component="h2"
            className={classes.body_right}
          >
            <p className={classes.addTitle}>{totalAdditions}</p>
            All additions
            <p className={classes.delTitle}>{totalDeletetions}</p>
            All deletions
          </Typography>
        </Typography>
      </CardContent>
    </Card>
  );
}

export default AddDel;
