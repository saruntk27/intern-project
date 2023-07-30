import React, { useState, useEffect } from "react";
import { useStateValue } from "../../../services/StateProvider";
import AuthAxios from "../../../services/AuthAxios";
import { Divider } from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import ".././css/ShowTeam.css";
import AddIcon from "@material-ui/icons/Add";
import PopupAddTeam from "./Popup/PopupAddTeam";
import TeamRow from "./TeamRow";

function ShowTeam() {
  const [{ user, jwt }] = useStateValue();
  const [loading, setLoading] = useState(true);
  const [teams, setTeams] = useState([]);
  const [showAddTeam, setShowAddTeam] = useState(false);
  const [updateTeam, setUpdateTeam] = useState(false);

  useEffect(() => {
    if (user.role === "Master") {
      fetchTeams();
    }
  }, [jwt, updateTeam]);

  const fetchTeams = async () => {
    setTeams([]);
    await AuthAxios(jwt)
      .get("/team")
      .then((res) => {
        try {
          if (res.data.name === "TokenExpiredError") {
            alert("Token expired");
            window.location = "/";
          } else {
            setTeams(res.data);
            setLoading(false);
          }
        } catch (e) {
          console.log(e);
        }
      });
  };

  const handleAddUserClose = () => {
    setShowAddTeam(false);
  };

  const handleUpdate = () => setUpdateTeam(!updateTeam);

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
    <div className="ShowMember">
      <div className="ShowMemberHeader">
        <div className="ShowMemberFilter">
          {user.role === "Master" && (
            <>
              <button
                className="addReportBtn"
                style={{ width: "250px" }}
                onClick={(e) => setShowAddTeam(true)}
              >
                <AddIcon />
                <span style={{ margin: "0px 0px 0px 5px" }}>Add new team</span>
              </button>
            </>
          )}
        </div>
        <div className="ShowMemberPage"></div>
      </div>
      <div className="ShowTeamBody">
        <div className="ShowMemberRow">
          <div
            className="ShowMemberHeaderInfo"
            style={{ marginBottom: "10px" }}
          >
            <p className="report_HeaderText" style={{ width: "240px" }}>
              Team name
            </p>
            <p className="report_HeaderText" style={{ width: "240px" }}>
              Member
            </p>
            <p style={{ width: "820px" }}></p>
            <div style={{ width: "180px" }}></div>
          </div>
          <Divider />
        </div>

        {loading ? (
          <div>
            <Divider />
            <div className={"ShowMemberInfo"}>
              <p style={{ width: "240px" }}>Loading...</p>
              <p style={{ width: "240px" }}>Loading...</p>
              <p style={{ width: "820px" }}></p>
              <div className="ShowMemberEdit">
                <DeleteIcon
                  style={{
                    color: "#1A4074",
                    pointerEvents: "visible",
                  }}
                />
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className={resize ? null : "ShowTeamWrapper"}>
              {teams.map((team, index) => (
                <>
                  <TeamRow
                    team={team}
                    handleUpdate={handleUpdate}
                    index={index}
                  />
                </>
              ))}
            </div>
          </>
        )}

        {!loading && teams.length === 0 ? (
          <p className="noReport">Don't have any teams</p>
        ) : null}

        <PopupAddTeam
          handleClose={handleAddUserClose}
          show={showAddTeam}
          handleUpdate={handleUpdate}
        />
      </div>
    </div>
  );
}

export default ShowTeam;
