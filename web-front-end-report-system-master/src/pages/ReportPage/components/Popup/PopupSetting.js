import React, { useState, useEffect } from "react";
import { Button, Modal, Spinner } from "react-bootstrap";
import { useStateValue } from "../../../../services/StateProvider";
import "../../css/PopupSetting.css";
import { EditText } from "react-edit-text";
import AuthAxios from "../../../../services/AuthAxios";

function PopupSetting({
  handleClose,
  show,
  handleUpdate,
  repositoryid,
  privateToken,
  teamid,
}) {
  const [{ jwt }] = useStateValue();
  const [repositoryidUpdate, setRepositoryidUpdate] = useState([]);
  const [privateTokenUpdate, setPrivateTokenUpdate] = useState("");
  const [teamidUpdate, setTeamidUpdate] = useState("");
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    setRepositoryidUpdate(repositoryid);
    setTeamidUpdate(teamid);
    if (localStorage.getItem("privateToken") !== null) {
      setPrivateTokenUpdate(localStorage.getItem("privateToken"));
    } else {
      setPrivateTokenUpdate("");
    }
  }, [repositoryid]);

  const onSubmit = async (e) => {
    e.preventDefault();
    const updateTeam = {
      repositoryid: repositoryidUpdate,
    };
    window.localStorage.privateToken = privateTokenUpdate;
    setUploading(true);
    await AuthAxios(jwt).post("/team/update/" + teamidUpdate, updateTeam);
    setUploading(false);
    handleUpdate();
    handleClose();
  };

  const addRepo = async (e) => {
    e.preventDefault();
    setRepositoryidUpdate((oldData) => [
      ...oldData,
      {
        repositoryid: "",
        repositoryname: "",
      },
    ]);
  };

  const popRepo = async (e) => {
    e.preventDefault();
    repositoryidUpdate.pop();
    setRepositoryidUpdate([...repositoryidUpdate]);
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
            <Modal.Title>
              <p className="popupSetting__title">Setting</p>
            </Modal.Title>
          </div>
          <div>
            <button className="popupBtn" onClick={addRepo}>
              Add Repo
            </button>
            <button className="popupBtnSettingDelete" onClick={popRepo}>
              Pop Repo
            </button>
          </div>
        </Modal.Header>
        <Modal.Body className="popupSettingWrapper">
          {repositoryidUpdate.map((repository, index) => (
            <>
              <div className="row">
                <div className={resize ? "col-5" : "col-3"}>
                  {repositoryidUpdate.length > 1 ? (
                    <p className="popupHeader marginTop">
                      Repository ID {index + 1} :{" "}
                    </p>
                  ) : (
                    <p className="popupHeader marginTop">Repository ID :</p>
                  )}
                </div>
                <div className={resize ? "col-7" : "col-9"}>
                  <EditText
                    placeholder="Insert your repository id"
                    className="popupText pl-0"
                    value={repository.repositoryid}
                    onChange={(value) => {
                      repositoryidUpdate[index].repositoryid = value;
                      setRepositoryidUpdate([...repositoryidUpdate]);
                    }}
                  />
                </div>
              </div>
              <div className="row">
                <div className={resize ? "col-5" : "col-3"}>
                  {repositoryidUpdate.length > 1 ? (
                    <p className="popupHeader marginTop">
                      Repository Name {index + 1} :{" "}
                    </p>
                  ) : (
                    <p className="popupHeader marginTop">Repository Name :</p>
                  )}
                </div>
                <div className={resize ? "col-7" : "col-9"}>
                  <EditText
                    placeholder="Insert your repository name that you want"
                    className="popupText pl-0"
                    value={repository.repositoryname}
                    onChange={(value) => {
                      repositoryidUpdate[index].repositoryname = value;
                      setRepositoryidUpdate([...repositoryidUpdate]);
                    }}
                  />
                </div>
              </div>
            </>
          ))}
          <div className="row">
            <div className={resize ? "col-5" : "col-3"}>
              <p className="popupHeader marginTop">Private Token :</p>
            </div>
            <div className={resize ? "col-7" : "col-9"}>
              <EditText
                placeholder={"Insert your private token"}
                className="popupText pl-0"
                style={{
                  wordWrap: "break-word",
                  whiteSpace: "pre-wrap",
                  lineHeight: "1.6",
                }}
                value={privateTokenUpdate}
                onChange={(e) => setPrivateTokenUpdate(e)}
              />
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <button className="popupBtnNoBorder" onClick={handleClose}>
            CANCEL
          </button>
          <div>
            <button className="popupBtn" onClick={onSubmit}>
              UPDATE
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
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default PopupSetting;
