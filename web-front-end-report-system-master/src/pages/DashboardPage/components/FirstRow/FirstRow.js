import React, { useEffect, useState } from "react";
import DashboardCard from "./DashboardCard";
import FolderIcon from "@material-ui/icons/Folder";
import AssignmentIcon from "@material-ui/icons/Assignment";
import InsertDriveFileIcon from "@material-ui/icons/InsertDriveFile";
import { makeStyles } from "@material-ui/core/styles";
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
  dashboard: {
    marginRight: 30,
  },
  icon: {
    fontSize: 80,
  },
  ulTeams: {
    paddingTop: "50px",
    paddingLeft: "20px",
    lineHeight: "10px",
  },
  ulTeamsLess: {
    paddingTop: "20px",
    paddingLeft: "20px",
    lineHeight: "10px",
  },
  liTeams: {
    opacity: 0.87,
    fontSize: 15,
    pointerEvents: "none",
  },
});

function FirstLow() {
  const [{ user, jwt }] = useStateValue();
  const [teamsname, setTeamsName] = useState([]);
  const [teamsTotal, setTeamsTotal] = useState(0);
  const [totalReports, setTotalReports] = useState(0);
  const [currentMonthReports, setCurrentMonthReports] = useState(0);
  const [totalTasks, setTotalTasks] = useState(0);
  const [currentMonthTask, setCurrentMonthTask] = useState(0);
  const [totalCommits, setTotalCommits] = useState(0);
  const [currentMonthCommits, setCurrentMonthCommits] = useState(0);

  const classes = useStyles();
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
        fetchTeams();
        fetchReports();
        fetchTasks();
        fetchCommits();
      }
    }
  }, [jwt]);

  const fetchTeams = async () => {
    await AuthAxios(jwt)
      .get(`/dashboard/teams`)
      .then((res) => {
        try {
          if (res.data.name === "TokenExpiredError") {
            TokenExpired();
          } else {
            setTeamsName(res.data.teamname);
            setTeamsTotal(res.data.teamsTotal);
          }
        } catch (e) {
          console.log(e);
        }
      });
  };

  const fetchReports = async () => {
    await AuthAxios(jwt)
      .get(`/dashboard/report/count`)
      .then((res) => {
        try {
          if (res.data.name === "TokenExpiredError") {
            TokenExpired();
          } else {
            setCurrentMonthReports(res.data.currentMonthReports);
            setTotalReports(res.data.totalReports);
          }
        } catch (e) {
          console.log(e);
        }
      });
  };

  const fetchTasks = async () => {
    await AuthAxios(jwt)
      .get(`/dashboard/report/tasks/count`)
      .then((res) => {
        try {
          if (res.data.name === "TokenExpiredError") {
            TokenExpired();
          } else {
            setTotalTasks(res.data.tasksTotal);
            setCurrentMonthTask(res.data.currentMonthTask);
          }
        } catch (e) {
          console.log(e);
        }
      });
  };

  const fetchCommits = async () => {
    await AuthAxios(jwt)
      .get(`/dashboard/report/commits/count`)
      .then((res) => {
        try {
          if (res.data.name === "TokenExpiredError") {
            TokenExpired();
          } else {
            setTotalCommits(res.data.totalCommits);
            setCurrentMonthCommits(res.data.currentMonthCommit);
          }
        } catch (e) {
          console.log(e);
        }
      });
  };

  const ListTeams = () => {
    return (
      <>
        <ul
          className={
            teamsname.length >= 4 ? classes.ulTeams : classes.ulTeamsLess
          }
        >
          {teamsname.length >= 4 ? (
            <>
              <li className={classes.liTeams} style={{ marginTop: "20px" }}>
                {teamsname[0]} 555
              </li>
              <li className={classes.liTeams} style={{ marginTop: "20px" }}>
                {teamsname[1]} 555
              </li>
              <li className={classes.liTeams} style={{ marginTop: "20px" }}>
                {teamsname[2]} 555
              </li>
              <li className={classes.liTeams} style={{ marginTop: "20px" }}>
                + {teamsname.length - 3} Team other
              </li>
            </>
          ) : (
            <>
              {teamsname.map((teamname) => (
                <li className={classes.liTeams} style={{ marginTop: "20px" }}>
                  {teamname}
                </li>
              ))}
            </>
          )}
        </ul>
      </>
    );
  };

  return (
    <div className={resize ? classes.rowResize : classes.row}>
      <DashboardCard
        title={"Current Teams"}
        teams={<ListTeams />}
        monthCount={teamsTotal}
        startColor={"#1A4074"}
        endColor={"#1A4074"}
      />
      <DashboardCard
        title={"This Month's Report"}
        subtitle={"total report"}
        monthCount={currentMonthReports}
        totalCount={totalReports}
        startColor={"#005D8C"}
        endColor={"#005D8C"}
        Icon={<FolderIcon className={classes.icon} />}
      />
      <DashboardCard
        title={"This Month's Task"}
        subtitle={"total task"}
        monthCount={currentMonthTask}
        totalCount={totalTasks}
        startColor={"#0079B6"}
        endColor={"#0079B6"}
        Icon={<AssignmentIcon className={classes.icon} />}
      />
      <DashboardCard
        title={"This Month's Commit"}
        subtitle={"total commit"}
        monthCount={currentMonthCommits}
        totalCount={totalCommits}
        startColor={"#00B7DA"}
        endColor={"#00B7DA"}
        Icon={<InsertDriveFileIcon className={classes.icon} />}
      />
    </div>
  );
}

export default FirstLow;
