import React, { useState, useEffect } from "react";
import { Modal, Spinner } from "react-bootstrap";
import AuthAxios from "../../../../services/AuthAxios";
import { useStateValue } from "../../../../services/StateProvider";

function PopupDeleteTeam({ team, handleClose, show, handleUpdate }) {
  const [{ jwt }] = useStateValue();
  const [teamid, setTeamid] = useState("");

  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    setTeamid(team._id);
  }, [team]);

  const onSubmit = async (e) => {
    e.preventDefault();

    setUploading(true);
    await AuthAxios(jwt)
      .delete("/team/" + teamid)
      .then((res) => updateTeamIDToDefault(res));
  };

  const updateTeamIDToDefault = (res) => {
    let users = [];
    users.push(res.data.leaderid);
    for (let i = 0; i < res.data.memberid.length; i++) {
      users.push(res.data.memberid[i]);
    }
    console.log(users);
    updateUsersTeamID(users);
  };

  const updateUsersTeamID = async (idUsers) => {
    for (let i = 0; i < idUsers.length; i++) {
      const user = {
        teamid: "",
        role: "",
      };
      await AuthAxios(jwt).post("/user/update/" + idUsers[i], user);
    }
    setUploading(false);
    handleUpdate();
    handleClose();
  };

  return (
    <div>
      <Modal
        show={show}
        onHide={handleClose}
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Body>
          <p className="popupDelete__title">Delete this Team ?</p>
          <p className="popupDelete__body">
            You will not be able to recover it
          </p>
          <div className="popupDeleteFooter">
            <button
              className="popupBtnNoBorder"
              onClick={handleClose}
              style={{ marginRight: "10px" }}
            >
              CANCEL
            </button>
            {uploading ? (
              <Spinner
                as="span"
                animation="grow"
                size="sm"
                role="status"
                aria-hidden="true"
                style={{ marginTop: "8px", marginRight: "5px" }}
              />
            ) : (
              <button className="popupDeleteBtn" onClick={onSubmit}>
                DELETE
              </button>
            )}
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default PopupDeleteTeam;
