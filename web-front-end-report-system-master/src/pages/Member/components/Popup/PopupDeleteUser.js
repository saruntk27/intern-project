import React, { useState, useEffect } from "react";
import { Modal, Spinner } from "react-bootstrap";
import "../../css/PopupDeleteUser.css";
import AuthAxios from "../../../../services/AuthAxios";
import { useStateValue } from "../../../../services/StateProvider";

function PopupDeleteUser({ user, handleClose, show, handleUpdate }) {
  const [{ jwt }] = useStateValue();
  const [userid, setUserid] = useState("");

  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    setUserid(user._id);
  }, [user]);

  const onSubmit = async (e) => {
    e.preventDefault();

    setUploading(true);
    await AuthAxios(jwt)
      .delete("/user/" + userid)
      .then((res) => responseDeleteMember(res));
    handleClose();
  };

  const responseDeleteMember = (res) => {
    if (res.data.error) {
      alert(res.data.error);
    }
    setUploading(false);
    handleUpdate();
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
          <p className="popupDelete__title">Delete this Member ?</p>
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

export default PopupDeleteUser;
