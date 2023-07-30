import React, { useState } from "react";
import { Divider } from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import PopupDeleteTeam from "./Popup/PopupDeleteTeam";
import PropsUpdateTeam from './Popup/PopupUpdateTeam'
import ShowProfile from "./ShowProfile";

function TeamRow(props) {
  const [selectedTeam, setSelectedTeam] = useState({});
  const [showDeleteTeam, setShowDeleteTeam] = useState(false);
  const [showUpdateTeam, setShowUpdateTeam] = useState(false);

  const handleDelete = (e, team) => {
    e.preventDefault();
    setSelectedTeam(team);
    setShowDeleteTeam(true);
  };

  const handleUpdate = (e, team) => {
    e.preventDefault();
    setSelectedTeam(team);
    setShowUpdateTeam(true);
  };

  const handleDeleteTeamClose = () => {
    setShowDeleteTeam(false);
  };

  const handleUpdateTeamClose = () => {
    setShowUpdateTeam(false);
  };

  return (
    <div>
      <Divider />
      <div className={"ShowMemberInfo"}>
        <p style={{ width: "240px" }}>{props.team.teamname}</p>
        <p
          style={{ width: "240px", paddingLeft: "15px" }}
          className="showProfile"
        >
          <ShowProfile id={props.team.leaderid}></ShowProfile>
          {props.team.memberid.map((id) => (
            <ShowProfile id={id}></ShowProfile>
          ))}
        </p>
        <p style={{ width: "820px" }}></p>
        <div className="ShowMemberEdit">
          <EditIcon
            style={{
              color: "#1A4074",
              marginRight: 10,
            }}
            onClick={(e) => handleUpdate(e, props.team)}
          />
          <DeleteIcon
            style={{
              color: "#1A4074",
            }}
            onClick={(e) => handleDelete(e, props.team)}
          />
        </div>
      </div>

      <PopupDeleteTeam
        team={selectedTeam}
        handleClose={handleDeleteTeamClose}
        show={showDeleteTeam}
        handleUpdate={props.handleUpdate}
      />
      <PropsUpdateTeam
        team={selectedTeam}
        handleClose={handleUpdateTeamClose}
        show={showUpdateTeam}
        handleUpdate={props.handleUpdate}
      />
    </div>
  );
}

export default TeamRow;
