import React, { useState, useEffect } from "react";
import { Button, Modal, Spinner } from "react-bootstrap";
import "../../css/PopupDeleteReport.css";
import AuthAxios from "../../../../services/AuthAxios";
import { useStateValue } from "../../../../services/StateProvider";

function PopupDeleteReport({ report, handleClose, show, handleUpdate }) {
  const [{ jwt }] = useStateValue();
  const [reportid, setReportid] = useState("");

  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    setReportid(report._id);
  }, [report]);

  const onSubmit = async (e) => {
    e.preventDefault();

    setUploading(true);
    await AuthAxios(jwt)
      .delete("/report/" + reportid)
      .then((res) => responseAddReport(res));
    handleClose();
  };

  const responseAddReport = (res) => {
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
          <p className="popupDelete__title">Delete this report ?</p>
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
            <button className="popupDeleteBtn" onClick={onSubmit}>
              DELETE
            </button>
            {uploading ? (
              <Button variant="primary" disabled style={{ marginLeft: "10px" }}>
                <Spinner
                  as="span"
                  animation="grow"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                  style={{ marginRight: "5px" }}
                />
                Loading...
              </Button>
            ) : null}
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default PopupDeleteReport;
