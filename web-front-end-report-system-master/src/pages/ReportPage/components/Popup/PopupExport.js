import React, { useState, useEffect } from "react";
import { Button, Modal, Spinner } from "react-bootstrap";
import AuthAxios, { authAxiosTest } from "../../../../services/AuthAxios";
import { EditText, EditTextarea } from "react-edit-text";
import "react-edit-text/dist/index.css";
import { useStateValue } from "../../../../services/StateProvider";
import "../../css/PopupReport.css";

function PopupExport({ handleClose, show, handleUpdate }) {
  const [{ user, jwt }] = useStateValue();
  const [googleSheetid, setGoogleSheetid] = useState("");
  const [private_key, setPrivate_Key] = useState("");
  const [client_email, setClient_email] = useState("");
  const [uploading, setUploading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);
    let today = new Date();
    let monthNumber = today.getMonth();
    
    const body = {
      doc: googleSheetid,
      private_key: private_key,
      client_email: client_email,
    };

    await authAxiosTest(jwt)
      .post(`/export/report/googlesheets/${monthNumber}`, body)
      .then((res) => {
        if (res.data.name === "TokenExpiredError") {
          window.location = "/";
        } else {
          console.log(res.data);
          setUploading(false);
          handleUpdate();
          handleClose();
        }
      })
      .catch((err) => alert(err));
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
            <Modal.Title>Export : </Modal.Title>
          </div>
        </Modal.Header>
        <Modal.Body className="pupupReport__wraper">
          <div className="row">
            <div className={resize ? "col-4" : "col-3"}>
              <p className="popupHeader" style={{ marginTop: "10px" }}>
                Google Sheets ID :
              </p>
            </div>
            <div className={resize ? "col-8" : "col-9"}>
              <EditText
                placeholder="ID of your spreadsheets"
                className="popupText pl-0"
                value={googleSheetid}
                onChange={(e) => setGoogleSheetid(e)}
              />
            </div>
          </div>
          <div className="row">
            <div className={resize ? "col-4" : "col-3"}>
              <p className="popupHeader" style={{ marginTop: "10px" }}>
                Private key :
              </p>
            </div>
            <div className={resize ? "col-8" : "col-9"}>
              <EditTextarea
                placeholder="private_key"
                className="popupText pl-0"
                value={private_key}
                onChange={(e) => setPrivate_Key(e)}
              />
            </div>
          </div>
          <div className="row">
            <div className={resize ? "col-4" : "col-3"}>
              <p className="popupHeader" style={{ marginTop: "10px" }}>
                Client email :
              </p>
            </div>
            <div className={resize ? "col-8" : "col-9"}>
              <EditText
                placeholder="client_email"
                className="popupText pl-0"
                value={client_email}
                onChange={(e) => setClient_email(e)}
              />
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <button className="popupBtnNoBorder" onClick={handleClose}>
            CANCEL
          </button>
          <div>
            {user.role === "Master" ? (
              <button className="popupBtn" onClick={onSubmit}>
                Export
              </button>
            ) : null}
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
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default PopupExport;
