import React, { useState, useEffect, useRef } from "react";
import { useStateValue } from "../../../services/StateProvider";
import AuthAxios from "../../../services/AuthAxios";
import "../css/ShowReports.css";
import { Divider } from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import NoteAddIcon from "@material-ui/icons/NoteAdd";
import ShowCommits from "./ShowCommits";
import PopupReport from "./Popup/PopupReport";
import moment from "moment";
import PopupDeleteReport from "./Popup/PopupDeleteReport";
import Setting from "./Setting";
import { Spinner } from "react-bootstrap";
import ReactTooltip from 'react-tooltip';
import { store } from "react-notifications-component";
import "react-notifications-component/dist/theme.css";
import PopupExport from "./Popup/PopupExport";
import ReportRow from "./ReportRow";
import PopupManualAddReport from "./Popup/PopupManualAddReport";

function ShowReports() {
  const [{ user, jwt }] = useStateValue();
  const [reports, setReports] = useState([]);
  const [teamSelect, setTeamSelect] = useState("");
  const [teams, setTeams] = useState([]);
  const [team, setTeam] = useState({});
  const [memberSelect, setMemberSelect] = useState("");
  const [members, setMembers] = useState([]);
  const teamInput = useRef();
  const memberInput = useRef();

  const [showCommits, setShowCommits] = useState(false);
  const [showReports, setShowReports] = useState(true);
  const [commits, setCommits] = useState([]);

  const [memberName, setMemberName] = useState("");
  const [commitsid, setCommitsid] = useState([]);

  const [updateReport, setUpdateReport] = useState(false);
  const [addCommit, setAddCommit] = useState(false);

  const branchInputRef = useRef();
  const [branches, setBranches] = useState([]);
  const [branchSelect, setBranchSelect] = useState("");

  const [loading, setLoading] = useState(true);

  const [fcm, setFCM] = useState("");

  const repositoryidInput = useRef();
  const [repositoryid, setRepositoryid] = useState([]);
  const [selectedRepositoryid, setSelectedRepositoryid] = useState("");

  const [usersid, setUsersid] = useState([]);

  //summary
  const [reportTotal, setReportTotal] = useState(0);
  const [tasksTotal, setTasksTotal] = useState(0);
  const [commitsTotal, setCommitsTotal] = useState(0);
  const [additionsTotal, setAdditionsTotal] = useState(0);
  const [deletionsTotal, setDeletionsTotal] = useState(0);
  const [day, setDays] = useState(0);
  const [dayToolTip, setDayToolTip] = useState("");

  //team
  useEffect(() => {
    if (user.role === "Master") {
      fetchTeams();
    } else if (user.role === "Leader") {
      fetchTeamByLeader();
    }
  }, [user._id, updateReport]);

  //members
  useEffect(() => {
    if (user.role === "Master") {
      fetchMembersByTeam();
    } else if (user.role === "Leader") {
      fetchMembersByLeader();
    }
  }, [jwt, teamSelect, updateReport]);

  //reports
  useEffect(() => {
    if (jwt !== null) {
      if (user.role === "Master" || user.role === "Leader") {
        fetchReportsByMember();
      } else {
        fetchReportsByMemberID();
      }
      getUserNamebyUserID();
    }
  }, [jwt, memberSelect, updateReport]);

  //branches
  useEffect(() => {
    if (user.role === "Leader") {
      setBranches([]);
      fetchBranches();
    }
  }, [jwt, team._id, updateReport, selectedRepositoryid]);

  //commits
  useEffect(() => {
    if (user.role === "Leader") {
      fetchCommits();
    }
  }, [jwt, branchSelect, updateReport, selectedRepositoryid, addCommit]);

  //commits
  useEffect(() => {
    if (user.role === "Leader") {
      fetchCommitidFromReportsInTeam();
    }
  }, [jwt, addCommit]);

  //users id for check report that user deleted
  useEffect(() => {
    if (user.role === "Master") {
      fetchUsersid();
    }
  }, [user._id, updateReport]);

  useEffect(() => {
    if (user.role !== "Master") {
      fetchSummary();
    }
  }, [user._id]);

  const fetchSummary = async () => {
    await AuthAxios(jwt)
      .get("/report/summary")
      .then((res) => {
        try {
          if (res.data.name === "TokenExpiredError") {
            alert("Token expired");
            window.location = "/";
          } else {
            let end = new Date(res.data.endDate);
            let start = new Date(res.data.startDate);
            // One day in milliseconds
            let oneDay = 1000 * 60 * 60 * 24;
            // Calculating the time difference between two dates
            let diffInTime = end.getTime() - start.getTime();
            // Calculating the no. of days between two dates
            let diffInDays = Math.round(diffInTime / oneDay);
            setReportTotal(res.data.reportTotal.toLocaleString())
            setTasksTotal(res.data.tasksTotal.toLocaleString())
            setCommitsTotal(res.data.commitsTotal.toLocaleString())
            setAdditionsTotal(res.data.additionsTotal.toLocaleString())
            setDeletionsTotal(res.data.deletionsTotal.toLocaleString())
            setDays(diffInDays)
            setDayToolTip(`${res.data.startDate.substring(0, 10)} - ${res.data.endDate.substring(0, 10)}`)
          }
        } catch (e) {
          console.log(e);
        }
      });
  };

  const fetchTeams = async () => {
    setTeamSelect("");
    await AuthAxios(jwt)
      .get("/team")
      .then((res) => {
        try {
          if (res.data.name === "TokenExpiredError") {
            alert("Token expired");
            window.location = "/";
          } else {
            if (res.data.length > 0) {
              setTeamSelect(res.data[0]._id);
              setTeams(res.data);
              setTeams((old) => [
                {
                  _id: "1",
                  teamname: "All Teams",
                },
                {
                  _id: "2",
                  teamname: "All Reports",
                },
                ...old,
              ]);
            } else {
              setTeams((old) => [
                {
                  _id: "1",
                  teamname: "All Teams",
                },
                {
                  _id: "2",
                  teamname: "All Reports",
                },
                ...old,
              ]);
              setTeamSelect("1");
            }
          }
        } catch (e) {
          console.log(e);
          store.addNotification({
            title: "Error",
            message: e.toString(),
            type: "danger", // 'default', 'success', 'info', 'warning'
            container: "bottom-right", // where to position the notifications
            animationIn: ["animated", "fadeIn"], // animate.css classes that's applied
            animationOut: ["animated", "fadeOut"], // animate.css classes that's applied
            dismiss: {
              duration: 5000,
            },
          });
        }
      });
  };

  const fetchTeamByLeader = async () => {
    await AuthAxios(jwt)
      .get("/team/leader/" + user._id)
      .then((res) => {
        try {
          if (res.data.name === "TokenExpiredError") {
            alert("Token expired");
            window.location = "/";
          } else {
            setTeam(res.data);
            setRepositoryid(res.data.repositoryid);
            setSelectedRepositoryid(res.data.repositoryid[0].repositoryid);
          }
        } catch (e) {
          console.log(e);
        }
      });
  };

  const fetchMembersByTeam = async () => {
    if (teamSelect === "") {
      return
    }
    setMemberSelect("");
    setMembers([]);
    if (teamSelect === "1") {
      // ALL Teams
      await AuthAxios(jwt)
        .get("/user")
        .then((res) => {
          try {
            if (res.data.name === "TokenExpiredError") {
              alert("Token expired");
              window.location = "/";
            } else {
              setMemberSelect(res.data[0]._id);
              setMembers(res.data);
            }
          } catch (e) {
            alert(e);
          }
        });
    } else if (teamSelect === "2") {
      console.log("All Reports set member select = 0");
      setMemberSelect("0");
    } else {
      // Selected Team
      await AuthAxios(jwt)
        .get("/user/team/" + teamSelect)
        .then((res) => {
          try {
            if (res.data.name === "TokenExpiredError") {
              alert("Token expired");
              window.location = "/";
            } else {
              setMemberSelect(res.data[0]._id);
              setMembers(res.data);
            }
          } catch (e) {
            store.addNotification({
              title: "Error",
              message: e.toString(),
              type: "danger", // 'default', 'success', 'info', 'warning'
              container: "bottom-right", // where to position the notifications
              animationIn: ["animated", "fadeIn"], // animate.css classes that's applied
              animationOut: ["animated", "fadeOut"], // animate.css classes that's applied
              dismiss: {
                duration: 5000,
              },
            });
          }
        });
    }
  };

  const fetchMembersByLeader = async () => {
    setMemberSelect("");
    setMembers([]);
    await AuthAxios(jwt)
      .get("/user/team/" + user.teamid)
      .then((res) => {
        try {
          if (res.data.name === "TokenExpiredError") {
            alert("Token expired");
            window.location = "/";
          } else {
            setMemberSelect(res.data[0]._id);
            setMembers(res.data);
            setMembers((old) => [
              {
                _id: user._id,
                username: user.username,
              },
              ...old,
            ]);
          }
        } catch (e) {
          console.log(e);
        }
      });
  };

  const fetchReportsByMember = async () => {
    if (memberSelect === "") {
      return
    }
    setLoading(true);
    setReports([]);
    if (memberSelect === "0") {
      await AuthAxios(jwt)
        .get("/report")
        .then((res) => {
          try {
            if (res.data.name === "TokenExpiredError") {
              alert("Token expired");
              window.location = "/";
            } else {
              setReports(res.data);
              setLoading(false);
            }
          } catch (e) {
            console.log(e);
          }
        });
    } else {
      await AuthAxios(jwt)
        .get("/report/user/" + memberSelect)
        .then((res) => {
          try {
            if (res.data.name === "TokenExpiredError") {
              alert("Token expired");
              window.location = "/";
            } else {
              setReports(res.data);
              setLoading(false);
            }
          } catch (e) {
            console.log(e);
          }
        });
    }
  };

  const fetchReportsByMemberID = async () => {
    setLoading(true);
    setReports([]);
    await AuthAxios(jwt)
      .get("/report/user/" + user._id)
      .then((res) => {
        try {
          if (res.data.name === "TokenExpiredError") {
            alert("Token expired");
            window.location = "/";
          } else {
            setReports(res.data);
            setLoading(false);
          }
        } catch (e) {
          console.log(e);
        }
      });
  };

  //branch
  const fetchBranches = async () => {
    if (selectedRepositoryid === "") {
      return
    }
    await AuthAxios(jwt)
      .get(
        `/gitlab/branches/${selectedRepositoryid}/${localStorage.getItem(
          "privateToken"
        )}`
      )
      .then((res) => {
        try {
          if (res.data.name === "TokenExpiredError") {
            alert("Token expired");
            window.location = "/";
          } else {
            if (res.data.name === "Error") {
              setCommits([]);
            } else {
              for (let i = 0; i < res.data.length; i++) {
                setBranchSelect(res.data[0].name);
                setBranches((oldData) => [...oldData, res.data[i].name]);
              }
            }
          }
        } catch (e) {
          console.log(e);
        }
      });
  };

  //commits
  const fetchCommits = async () => {
    setCommits([]);
    if (branchSelect === "") {
      return
    }
    if (branchSelect.includes("/")) {
      setBranchSelect(branchSelect.replace("/", "%2f"));
    }
    setLoading(true);
    await AuthAxios(jwt)
      .get(
        `/gitlab/commits/branch/${branchSelect}/${selectedRepositoryid}/${localStorage.getItem(
          "privateToken"
        )}`
      )
      .then((res) => {
        try {
          if (res.data.name === "TokenExpiredError") {
            alert("Token expired");
            window.location = "/";
          } else {
            if (res.data.name === "Error") {
              setCommits([]);
            } else {
              setCommits(res.data);
              setLoading(false);
            }
          }
        } catch (e) {
          console.log(e);
        }
      });
  };

  //commit id from reports in team
  const fetchCommitidFromReportsInTeam = async () => {
    await AuthAxios(jwt)
      .post(`/report/leader/${user._id}`)
      .then((res) => {
        try {
          if (res.data.name === "TokenExpiredError") {
            alert("Token expired");
            window.location = "/";
          } else {
            if (res.data.name === "Error") {
              setCommitsid([]);
            } else {
              setCommitsid([]);
              for (let i = 0; i < res.data.length; i++) {
                setCommitsid((oldData) => [...oldData, res.data[i].commitid]);
              }
            }
          }
        } catch (e) {
          console.log(e);
        }
      });
  };

  //users id for check deleted user
  const fetchUsersid = async () => {
    await AuthAxios(jwt)
      .get(`/user`)
      .then((res) => {
        try {
          if (res.data.name === "TokenExpiredError") {
            alert("Token expired");
            window.location = "/";
          } else {
            for (let i = 0; i < res.data.length; i++) {
              setUsersid((oldData) => [...oldData, res.data[i]._id]);
            }
          }
        } catch (e) {
          console.log(e);
        }
      });
  };

  const handleShow = (e) => {
    e.preventDefault();
    setShowCommits(true);
    setShowReports(false);
  };

  const [showManualAddReport, setShowManualAddReport] = useState(false);

  const handleShowManualAddReport = (e) => {
    e.preventDefault();
    setShowManualAddReport(true);
  };

  const handleCloseManualAddReport = () => {
    setShowManualAddReport(false);
  };

  const getUserNamebyUserID = async () => {
    if (memberSelect === "0") {
      return
    }
    await AuthAxios(jwt)
      .get("/user/" + memberSelect)
      .then((res) => {
        if (res.data.name === "TokenExpiredError") {
          window.location = "/";
        } else {
          setMemberName(res.data.username);
          setFCM(res.data.fcm);
        }
      });
  };

  const [showExport, setShowExport] = useState(false);
  const handleExportClose = () => {
    setShowExport(false);
  };

  const handleUpdate = () => setUpdateReport(!updateReport);
  const handleAddCommit = () => setAddCommit(!addCommit);

  //export to google sheet
  const [loadingExport, setLoadingExport] = useState(false);
  const handleExportToExcel = async () => { };

  //sort
  const [toggleSort, setToggleSort] = useState(false);
  const sortReport = (column) => {
    //reports
    if (column === "Date") {
      const sortedReport = [...reports].sort((a, b) => {
        if (column === "Date") {
          if (toggleSort) {
            return new Date(b.createdAt) - new Date(a.createdAt);
          } else {
            return new Date(a.createdAt) - new Date(b.createdAt);
          }
        } else {
          if (toggleSort) {
            return b[column] - a[column];
          } else {
            return a[column] - b[column];
          }
        }
      });
      setToggleSort(!toggleSort);
      setReports(sortedReport);
    }
    // commits
    else if (column === "committer_name") {
      const sortedCommits = [...commits].sort((a, b) => {
        if (toggleSort) {
          return a[column].localeCompare(b[column]);
        } else {
          return b[column].localeCompare(a[column]);
        }
      });
      setToggleSort(!toggleSort);
      setCommits(sortedCommits);
    } else if (column === "committed_date") {
      const sortedCommits = [...commits].sort((a, b) => {
        if (toggleSort) {
          return new Date(b.committed_date) - new Date(a.committed_date);
        } else {
          return new Date(a.committed_date) - new Date(b.committed_date);
        }
      });
      setToggleSort(!toggleSort);
      setCommits(sortedCommits);
    }
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
    <div className="ShowReport">
      <ReactTooltip />
      <div
        className="ShowReportHeader"
        style={
          user.role === "Master" && resize ? { marginBottom: "51px" } : null
        }
      >
        <div className="ShowReportFilter">
          {user.role === "Master" && (
            <select
              ref={teamInput}
              style={{ marginRight: "20px" }}
              required
              className="FormTeamFilter"
              onChange={(e) => setTeamSelect(e.target.value)}
            >
              {teams.map((team) => (
                <option key={team._id} value={team._id}>
                  {team.teamname}
                </option>
              ))}
            </select>
          )}

          {user.role === "Leader" && (
            <span className="ReportTeamName">{team.teamname}</span>
          )}

          {user.role === "Master" || user.role === "Leader" ? (
            <>
              {memberSelect !== "0" ? (
                <select
                  ref={memberInput}
                  style={{ marginRight: "20px" }}
                  required
                  className="FormTeamFilter"
                  onChange={(e) => setMemberSelect(e.target.value)}
                >
                  {members.map((member) => (
                    <option key={member._id} value={member._id}>
                      {member.username}
                    </option>
                  ))}
                </select>
              ) : null}
            </>
          ) : null}

          {user.role === "Master" && teams.length === 0 && !loading ? (
            <span
              style={{
                fontSize: 20,
                color: "black",
                fontWeight: 500,
                opacity: 0.7,
                fontFamily: "Roboto",
              }}
            >
              Don't have any teams
            </span>
          ) : null}

          {user.role === "Leader" && (
            <>
              {showReports && (
                <>
                  <button
                    className="addReportBtn"
                    style={{ width: "250px", marginRight: 10 }}
                    onClick={handleShow}
                  >
                    <NoteAddIcon></NoteAddIcon>
                    <span style={{ margin: "0px 0px 0px 5px" }}>
                      Add new report from Gitlab
                    </span>
                  </button>
                </>
              )}
            </>
          )}

          {showCommits ? (
            <>
              <select
                ref={repositoryidInput}
                style={{ marginRight: "20px" }}
                required
                className="FormTeamFilter"
                onChange={(e) => setSelectedRepositoryid(e.target.value)}
              >
                {repositoryid.map((repository) => (
                  <option
                    key={repository.repositoryid}
                    value={repository.repositoryid}
                  >
                    {repository.repositoryname}
                  </option>
                ))}
              </select>
              {branches.length !== 0 ? (
                <select
                  ref={branchInputRef}
                  style={{ marginRight: "20px" }}
                  required
                  className="FormTeamFilter"
                  onChange={(e) => setBranchSelect(e.target.value)}
                >
                  {branches.map((branch, index) => (
                    <option key={index} value={branch}>
                      {branch}
                    </option>
                  ))}
                </select>
              ) : (
                <p>Please check your repository id and private token</p>
              )}
            </>
          ) : null}
        </div>

        <div className="ShowReportPage">
          {/* {user.role === "Master" && (
            <>
              {loadingExport ? (
                <Spinner
                  as="span"
                  animation="grow"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                  style={{ marginRight: "5px" }}
                />
              ) : (
                <>
                  <button
                    className="addReportBtn"
                    style={{ width: "250px" }}
                    onClick={() => setShowExport(true)}
                  >
                    <NoteAddIcon></NoteAddIcon>
                    <span style={{ marginLeft: "10px" }}>
                      Export to GoogleSheets
                    </span>
                  </button>
                </>
              )}
            </>
          )} */}

          {user.role !== "Master" && (
            <div className="summary">
              <div className="summaryItem">
                <p>{user.username}</p>
                <span>Summary Stats</span>
              </div>
              <div className="summaryItem" data-tip={dayToolTip}>
                <p>{day}</p>
                <span>Days</span>
              </div>
              <div className="summaryItem">
                <p>{reportTotal}</p>
                <span>Reports</span>
              </div>
              <div className="summaryItem">
                <p>{tasksTotal}</p>
                <span>Tasks</span>
              </div>
              <div className="summaryItem">
                <p>{commitsTotal}</p>
                <span>Commits</span>
              </div>
              <div className="summaryItem">
                <p>{additionsTotal}</p>
                <span>Additions</span>
              </div>
              <div className="summaryItem">
                <p>{deletionsTotal}</p>
                <span>Deletions</span>
              </div>
            </div>
          )}

          {user.role === "Leader" && (
            <>
              {showReports && (
                <>
                  <button
                    className="addReportBtn ml-3"
                    style={{ width: "250px", marginRight: "10px" }}
                    onClick={handleShowManualAddReport}
                  >
                    <NoteAddIcon></NoteAddIcon>
                    <span style={{ margin: "0px 0px 0px 5px" }}>
                      Add manual report
                    </span>
                  </button>
                </>
              )}
            </>
          )}
          {user.role === "Leader" && (
            <Setting
              handleUpdate={handleUpdate}
              repositoryid={team.repositoryid}
              privateToken={team.privateToken}
              teamid={team._id}
            />
          )}
        </div>
      </div>
      <div
        className={
          user.role === "Member" ? "ShowReportBodyMember" : "ShowReportBody"
        }
        style={resize && showCommits ? { marginTop: "85px" } : null}
      >
        <div className="ShowReportRow">
          <div
            className="ShowReportHeaderInfo"
            style={{ marginBottom: "10px" }}
          >
            {!showCommits && (
              <p className="report_HeaderText" style={{ width: "50px" }}>
                #
              </p>
            )}
            <p
              className="report_HeaderText"
              style={{ width: "180px" }}
            // onClick={() =>
            //   sortReport(showCommits ? "committed_date" : "Date")
            // }
            >
              Date
            </p>
            {showCommits ? (
              <p
                className="report_HeaderText"
                // onClick={() => sortReport("committer_name")}
                // style={{ cursor: "pointer" }}
              >
                Committer
              </p>
            ) : (
              <p className="report_HeaderText">Member</p>
            )}
            <p className="report_HeaderText" style={{ width: "240px" }}>
              task
            </p>
            <p className="report_HeaderText" style={{ width: "240px" }}>
              commit
            </p>
            <p
              className="report_HeaderText"
              style={showCommits ? { width: "100px" } : { width: "100px" }}
            >
              additions
            </p>
            <p
              className="report_HeaderText"
              style={showCommits ? { width: "100px" } : { width: "100px" }}
            >
              deletetions
            </p>
            {!showCommits && (
              <p className="report_HeaderText" style={{ width: "240px" }}>
                comment
              </p>
            )}
            <div style={{ width: "100px" }}></div>
          </div>
          <Divider />
        </div>

        {loading ? (
          // <div>
          //   <Divider />
          //   <div className={"ShowReportInfo"}>
          //     <p style={{ width: "180px" }}>Loading...</p>
          //     <p>Loading...</p>
          //     <p style={{ width: "240px" }}>Loading...</p>
          //     <p style={{ width: "240px" }}>Loading...</p>
          //     <p style={{ width: "100px" }}>Loading...</p>
          //     <p style={{ width: "100px" }}>Loading...</p>
          //     <p style={{ width: "240px" }}>Loading...</p>
          //     <div className="ShowReportEdit"></div>
          //   </div>
          // </div>
          null
        ) : (
          <>
            {reports.length > 0 ? (
              <div className={resize ? null : "ShowReportInfoWrapper"}>
                {reports.map((report, i) => (
                  <>
                    <ReportRow
                      report={report}
                      showCommits={showCommits}
                      i={i}
                      length={reports.length}
                      handleUpdate={handleUpdate}
                      usersid={usersid}
                    />
                  </>
                ))}
              </div>
            ) : (
              <>
                {!showCommits && (
                  <>
                    {user.role === "Member" ? (
                      <p className="noReportMember">Don't have any reports</p>
                    ) : (
                      <p className="noReport">Don't have any reports</p>
                    )}
                  </>
                )}
              </>
            )}
          </>
        )}

        {showExport && (
          <PopupExport
            handleClose={handleExportClose}
            show={showExport}
            handleUpdate={handleUpdate}
          />
        )}

        <div className={resize ? null : "ShowReportInfoWrapper"}>
          {commits.length > 0 ?
            (
              commits.map((commit, index) => (
                <>
                  {showCommits && user.role === "Leader" ? (
                    <ShowCommits
                      key={commit.id}
                      id={commit.id}
                      index={index}
                      jwt={jwt}
                      repositoryid={selectedRepositoryid}
                      privateToken={team.privateToken}
                      member={memberName}
                      memberid={memberSelect}
                      fcm={fcm}
                      showCommits={showCommits}
                      commitsid={commitsid}
                      handleAddCommit={handleAddCommit}
                    ></ShowCommits>
                  ) : null}
                </>
              ))
            ) : <>
              {showCommits && user.role === "Leader" ?
                <>
                  {loading
                    ? <p className="noReport">
                      < Spinner
                        as="span"
                        animation="grow"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                        style={{ marginRight: "5px" }}
                      />
                    </p>
                    :
                    < p className="noReport" style={{ height: "100%" }}>Don't have any commits in this branch from 15 days ago till now</p>
                  }
                </>
                : null}
            </>
          }
        </div>

        {showManualAddReport && (
          <PopupManualAddReport
            handleClose={handleCloseManualAddReport}
            show={showManualAddReport}
            handleUpdate={handleUpdate}
            member={memberName}
            memberid={memberSelect}
          />
        )}
      </div>
    </div >
  );
}
export default ShowReports;
