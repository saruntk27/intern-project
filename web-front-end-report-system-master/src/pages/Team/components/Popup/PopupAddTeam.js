import React, { useState, useEffect } from "react";
import { Modal, Spinner } from "react-bootstrap";
import AuthAxios from "../../../../services/AuthAxios";
import { useStateValue } from "../../../../services/StateProvider";
import "../../css/PopupAddTeam.css";

function PopupAddTeam(props) {
  const [{ jwt }] = useStateValue();
  const [uploading, setUploading] = useState(false);
  const [teamName, setTeamName] = useState("");

  const [memberNoTeam, setMemberNoTeam] = useState([]);
  const [members, setMembers] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    resetInput();
    fetchMemberNoTeam();
  }, []);

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
        }
      });
    setLoading(false);
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
      const team = {
        teamname: teamName,
        leadername: leadername,
        leaderid: leaderid,
        memberid: cloneMembers.map((member) => member._id),
      };

      let teamid = "";

      console.log(team);

      await AuthAxios(jwt)
        .post("/team/add", team)
        .then((res) => {
          if (res.data.name === "TokenExpiredError") {
            window.location = "/";
          } else {
            teamid = res.data._id;
          }
        });
      await updateLeaderTeamID(teamid, leaderid);
      await updateMemberTeamID(teamid, cloneMembers);
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
    await AuthAxios(jwt).post("/user/update/" + leaderid, user);
  };

  const updateMemberTeamID = async (teamid, idMembers) => {
    for (let i = 0; i < idMembers.length; i++) {
      const user = {
        teamid: teamid,
        role: "Member",
      };
      await AuthAxios(jwt).post("/user/update/" + idMembers[i]._id, user);
    }
    props.handleUpdate();
    props.handleClose();
    setUploading(false);
    resetInput();
  };

  const resetInput = () => {
    setTeamName("");
    setMembers([]);
  };

  return (
    <div>
      <Modal
        size="lg"
        show={props.show}
        onHide={props.handleClose}
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
              {!loading ? (
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
              ) : (
                <p>Loading...</p>
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
              onClick={props.handleClose}
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
                  ADD
                </button>
              )}
            </div>
          </div>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default PopupAddTeam;
