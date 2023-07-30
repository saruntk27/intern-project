import React, { useState, useEffect } from "react";
import { Modal, Spinner } from "react-bootstrap";
import AuthAxios from "../../../../services/AuthAxios";
import { useStateValue } from "../../../../services/StateProvider";
import "../../css/PopupAddTeam.css";

function PopupUpdateTeam({ team, handleClose, show, handleUpdate }) {
  const [{ jwt }] = useStateValue();
  const [uploading, setUploading] = useState(false);

  const [teamName, setTeamName] = useState("");
  const [memberNoTeam, setMemberNoTeam] = useState([]);
  const [members, setMembers] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setMembers([]);
    setMemberNoTeam([]);
    setTeamName("");
    setTeamName(team.teamname);
    fetchMemberNoTeam();
    if (team.memberid !== undefined) {
      fetchMembersInTeam();
    }
  }, [team._id]);

  const fetchMemberNoTeam = async () => {
    setLoading(true);
    await AuthAxios(jwt)
      .post("/user/noteam")
      .then((res) => {
        if (res.data.name === "TokenExpiredError") {
          alert("Token expired");
          window.location = "/";
        } else {
          setMemberNoTeam(res.data);
          setLoading(false);
        }
      });
  };

  const fetchMembersInTeam = async () => {
    setMembers((oldData) => [
      ...oldData,
      {
        username: team.leadername,
        _id: team.leaderid,
      },
    ]);
    for (let i = 0; i < team.memberid.length; i++) {
      await AuthAxios(jwt)
        .get("/user/" + team.memberid[i])
        .then((res) => {
          if (res.data.name === "TokenExpiredError") {
            alert("Token expired");
            window.location = "/";
          } else {
            setMembers((oldData) => [
              ...oldData,
              {
                username: res.data.username,
                _id: res.data._id,
              },
            ]);
          }
        });
    }
  };

  const handleMembers = (name, id, index) => {
    //remove from select
    memberNoTeam.splice(index, 1);

    //add to select
    setMembers((oldData) => [
      ...oldData,
      {
        username: name,
        _id: id,
      },
    ]);
  };

  const handeleRemoveMemberid = (id, memberindex) => {
    let cancelAddMember = members[memberindex];
    //remove from select
    members.splice(memberindex, 1);

    //add to select
    setMemberNoTeam((oldData) => [...oldData, cancelAddMember]);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    let isCheckTeamPass = checkTeam();
    if (isCheckTeamPass) {
      setUploading(true);
      let leadername = members[0].username;
      let leaderid = members[0]._id;
      let cloneMembers = [...members];
      cloneMembers.shift();
      const teamUpdate = {
        teamname: teamName,
        leadername: leadername,
        leaderid: leaderid,
        memberid: cloneMembers.map((member) => member._id),
      };

      await AuthAxios(jwt)
        .post("/team/update/" + team._id, teamUpdate)
        .catch((err) => console.log(err));

      await updateLeaderTeamID(team._id, leaderid);
      await updateMembersTeamID(team._id, cloneMembers);
      await updateMembersNoTeam();
      handleUpdate();
      handleClose();
      setUploading(false);
    }
  };

  const checkTeam = () => {
    if (teamName === "") {
      alert("Please insert team name");
      return false;
    } else if (members.length === 0) {
      alert("Please select leader and members");
      return false;
    } else if (members.length === 1) {
      alert("Please select members");
      return false;
    }
    return true;
  };

  const updateLeaderTeamID = async (teamid, leaderid) => {
    const user = {
      teamid: teamid,
      role: "Leader",
    };
    await AuthAxios(jwt)
      .post("/user/update/" + leaderid, user)
      .catch((err) => console.log(err));
  };

  const updateMembersTeamID = async (teamid, idMembers) => {
    for (let i = 0; i < idMembers.length; i++) {
      const user = {
        teamid: teamid,
        role: "Member",
      };
      await AuthAxios(jwt)
        .post("/user/update/" + idMembers[i]._id, user)
        .catch((err) => console.log(err));
    }
  };

  const updateMembersNoTeam = async () => {
    for (let i = 0; i < memberNoTeam.length; i++) {
      const userUpdate = {
        role: "",
        teamid: "",
      };
      await AuthAxios(jwt)
        .post("/user/update/" + memberNoTeam[i]._id, userUpdate)
        .catch((err) => console.log(err));
    }
  };

  return (
    <div>
      <Modal
        size="lg"
        show={show}
        onHide={handleClose}
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header>
          <div>
            <div className="row popupAddUser__rowForm">
              <div className="col-12">
                <p className="popUpAddUser__Text">Team Name</p>
                <input
                  className="popupAddUser__input"
                  type="text"
                  placeholder="Team name"
                  value={teamName}
                  style={{ width: "324px", height: "59px" }}
                  onChange={(e) => setTeamName(e.target.value)}
                ></input>
              </div>
            </div>
          </div>
        </Modal.Header>
        <Modal.Body className="PopupAddTeam__Body">
          <div className="PopupAddTeam__BodyLeft">
            <p className="popUpAddUser__Text" style={{ marginBottom: "10px" }}>
              Members
            </p>
            <div
              className="PopupAddTeam__BodyMember"
              style={{ height: "100%" }}
            >
              {loading ? (
                <p>Loading...</p>
              ) : (
                <>
                  {memberNoTeam.map((user, index) => (
                    <div
                      key={user._id}
                      className="leaderInfo"
                      onClick={() =>
                        handleMembers(user.username, user._id, index)
                      }
                      style={{ border: "1px solid #0000002a" }}
                    >
                      <div className="flexColumn">
                        <p style={{ paddingLeft: "4px" }}>{user.username}</p>
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>
          <div className="PopupAddTeam__BodyRight">
            <p className="popUpAddUser__Text" style={{ marginBottom: "10px" }}>
              Selected Leader
            </p>
            <div className="PopupAddTeam__BodyLeader">
              {members.length > 0 ? (
                <div
                  className="leaderInfo selectedLeader"
                  style={{ border: "1px solid #0000002a" }}
                  onClick={() => handeleRemoveMemberid(members[0].id, 0)}
                >
                  <div className="flexColumn">
                    <p style={{ paddingRight: "4px" }}>{members[0].username}</p>
                  </div>
                </div>
              ) : null}
            </div>
            <p className="popUpAddUser__Text" style={{ marginBottom: "10px" }}>
              Selected Members
            </p>
            <div className="PopupAddTeam__BodyMember">
              {members !== []
                ? members.map((member, index) => (
                    <>
                      {index >= 1 ? (
                        <div
                          className="leaderInfo selectedLeader"
                          style={{ border: "1px solid #0000002a" }}
                          onClick={() =>
                            handeleRemoveMemberid(member.id, index)
                          }
                        >
                          <div className="flexColumn">
                            <p style={{ paddingRight: "4px" }}>
                              {member.username}
                            </p>
                          </div>
                        </div>
                      ) : null}
                    </>
                  ))
                : null}
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <div className="popupAddUser__Bottom">
            <button
              className="popupBtnNoBorder"
              onClick={handleClose}
              style={{ marginRight: 10 }}
            >
              CANCEL
            </button>
            <div>
              {uploading ? (
                <Spinner
                  as="span"
                  animation="grow"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                  style={{ marginRight: "5px" }}
                />
              ) : (
                <button className="popupBtn" onClick={onSubmit}>
                  UPDATE
                </button>
              )}
            </div>
          </div>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default PopupUpdateTeam;
