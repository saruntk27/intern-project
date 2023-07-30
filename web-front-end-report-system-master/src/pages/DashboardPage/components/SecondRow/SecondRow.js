import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import AddDel from "./AddDel";
import Progress from "./Progress";
import { useStateValue } from "../../../../services/StateProvider";
import AuthAxios from "../../../../services/AuthAxios";
import TokenExpired from "../../../../services/TokenExpired";

const useStyles = makeStyles({
  row: {
    display: "flex",
    flex: 1,
    flexWrap: "wrap",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  rowResize: {
    display: "flex",
    flexWrap: "wrap",
    flexDirection: "row",
    justifyContent: "center",
  },
});

function SecondRow() {
  const [{ user, jwt }] = useStateValue();
  const classes = useStyles();
  const [resize, setResize] = useState(false);
  const [progress, setProgress] = useState(0);
  const [totalTeams, setTotalTeams] = useState(0);
  const [percent, setPercent] = useState(0);

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
        fetchProgressToday();
      }
    }
  }, [jwt]);

  const fetchProgressToday = async () => {
    await AuthAxios(jwt)
      .get(`/dashboard/report/progress/today`)
      .then((res) => {
        try {
          if (res.data.name === "TokenExpiredError") {
            TokenExpired();
          } else {
            setTotalTeams(res.data.totalTeams);
            calculate(res.data.progress, res.data.totalTeams);
          }
        } catch (e) {
          console.log(e);
        }
      });
  };

  const calculate = (progress, teams) => {
    if (progress && teams > 0) {
      let percent = Math.round((progress / teams) * 100);
      setProgress(progress);
      if (percent > 100) {
        setPercent(100);
      } else {
        setPercent(percent);
      }
    }
  };

  return (
    <div className={resize ? classes.rowResize : classes.row}>
      <AddDel />
      <Progress
        title={"Daily Report Progress"}
        subtitle={`Team report finished ${progress} of ${totalTeams}`}
        percent={percent}
      />
      <Progress
        title={"Weekly Report Progress"}
        subtitle={`Team report finished ${progress} of ${totalTeams}`}
        percent={percent}
      />
    </div>
  );
}

export default SecondRow;
