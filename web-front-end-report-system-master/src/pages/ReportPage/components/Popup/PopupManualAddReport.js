import React, { useState, useEffect } from "react";
import { Button, Modal, Spinner } from "react-bootstrap";
import AuthAxios from "../../../../services/AuthAxios";
import { useStateValue } from "../../../../services/StateProvider";
import "../../css/Popup.css";
import { EditText } from "react-edit-text";
import moment from "moment";
import AddBoxIcon from "@material-ui/icons/AddBox";
import DeleteIcon from "@material-ui/icons/Delete";

function PopupManualAddReport({ handleClose, show, member, memberid, fcm }) {
  const [{ user, jwt }] = useStateValue();
  const [commitEdit, setCommitEdit] = useState([]);
  const [taskEdit, setTaskEdit] = useState([]);
  const [additionEdit, setAdditionEdit] = useState([]);
  const [deletionsEdit, setdeletionsEdit] = useState([]);
  const [comment, setComment] = useState("");
  const [url, setUrl] = useState("");
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    setTaskEdit((oldData) => [...oldData, ""]);
    setCommitEdit((oldData) => [...oldData, ""]);
    setAdditionEdit((oldData) => [...oldData, 0]);
    setdeletionsEdit((oldData) => [...oldData, 0]);
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();

    const report = {
      task: taskEdit,
      commits: commitEdit,
      additions: additionEdit,
      deletetions: deletionsEdit,
      comment: comment,
      leadername: user.username,
      leaderid: user._id,
      username: member,
      userid: memberid,
      commitid: null,
      web_url: url,
      committed_date: null,
      selected_date: new Date(), //Ex. 2021-06-14
    };
    setUploading(true);
    let reportid = "";
    await AuthAxios(jwt)
      .post("/report/add", report)
      .then((res) => {
        if (res.data.error) {
          alert(res.data.error);
        } else {
          reportid = res.data._id;
        }
      });
    const notification = {
      reportid: reportid,
      username: member,
      userid: memberid,
      description: "Add new report",
    };

    console.log(fcm);
    const fcmObject = {
      to: fcm,
      data: {
        notification: {
          title: "New Report",
          body: "Leader add new report",
          icon: "https://image.flaticon.com/icons/png/512/839/839671.png",
        },
      },
    };
    await AuthAxios(jwt).post("/notification/report/fcm", fcmObject);

    await addNotificationModel(notification);
    setUploading(false);
  };

  const sendFCM = async () => {
    const fcmObject = {
      to: fcm,
      data: {
        notification: {
          title: "New Report",
          body: "Leader add new report",
          icon: "https://image.flaticon.com/icons/png/512/839/839671.png",
        },
      },
    };
    await AuthAxios(jwt)
      .get("/notification/report/fcm", fcmObject)
      .then((res) => {
        console.log(res.data);
      });
  };

  const addNotificationModel = async (notification) => {
    await AuthAxios(jwt)
      .post("/notification/report/add", notification)
      .then((res) => {
        console.log(res.data);
        handleClose();
        setUploading(false);
        window.location = "/report";
      });
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

  const addTask = async (e) => {
    e.preventDefault();
    setTaskEdit((oldData) => [...oldData, ""]);
  };

  const popTask = async (e) => {
    e.preventDefault();
    taskEdit.pop();
    setTaskEdit([...taskEdit]);
  };

  const addCommit = async (e) => {
    e.preventDefault();
    setCommitEdit((oldData) => [...oldData, ""]);
  };

  const popCommit = async (e) => {
    e.preventDefault();
    commitEdit.pop();
    setCommitEdit([...commitEdit]);
  };

  const addAdditions = async (e) => {
    e.preventDefault();
    setAdditionEdit((oldData) => [...oldData, 0]);
  };

  const popAdditions = async (e) => {
    e.preventDefault();
    additionEdit.pop();
    setAdditionEdit([...additionEdit]);
  };

  const addDeletions = async (e) => {
    e.preventDefault();
    setdeletionsEdit((oldData) => [...oldData, 0]);
  };

  const popDeletions = async (e) => {
    e.preventDefault();
    deletionsEdit.pop();
    setdeletionsEdit([...deletionsEdit]);
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
          <div className="row">
            <div className="col-12">
              <Modal.Title>Add report to : {member}</Modal.Title>
            </div>
            <div className="col-12 mt-2">
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <button
                  className="popupBtn"
                  style={{ marginRight: "25px", width: "120px" }}
                  onClick={addCommit}
                >
                  <AddBoxIcon style={{ marginRight: "3px" }} /> Commit
                </button>
                <button
                  className="popupBtnSettingDelete"
                  style={{ marginRight: "5px" }}
                  onClick={popCommit}
                >
                  <DeleteIcon />
                  Commit
                </button>
              </div>
            </div>
            <div className="col-12 mt-2">
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <button
                  className="popupBtn"
                  style={{ marginRight: "25px", width: "120px" }}
                  onClick={addTask}
                >
                  <AddBoxIcon style={{ marginRight: "3px" }} />
                  Task
                </button>
                <button
                  className="popupBtnSettingDelete"
                  style={{ marginRight: "5px" }}
                  onClick={popTask}
                >
                  <DeleteIcon />
                  Task
                </button>
              </div>
            </div>
            <div className="col-12 mt-2">
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <button
                  className="popupBtn"
                  style={{ marginRight: "5px", width: "120px" }}
                  onClick={addAdditions}
                >
                  <AddBoxIcon style={{ marginRight: "3px" }} /> Addition
                </button>
                <button
                  className="popupBtnSettingDelete"
                  style={{ marginRight: "5px" }}
                  onClick={popAdditions}
                >
                  <DeleteIcon />
                  Addition
                </button>
              </div>
            </div>
            <div className="col-12 mt-2">
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <button
                  className="popupBtn"
                  style={{ marginRight: "5px", width: "120px" }}
                  onClick={addDeletions}
                >
                  <AddBoxIcon style={{ marginRight: "3px" }} /> Deletion
                </button>
                <button
                  className="popupBtnSettingDelete"
                  style={{ marginRight: "5px" }}
                  onClick={popDeletions}
                >
                  <DeleteIcon />
                  Deletion
                </button>
              </div>
            </div>
          </div>
        </Modal.Header>
        <Modal.Body className="pupupCommit__wraper" style={{ height: 330 }}>
          {commitEdit.map((commit, index) => (
            <div className="row">
              <div className={resize ? "col-3" : "col-2"}>
                {commitEdit.length > 1 ? (
                  <p className="popupHeader marginTop">commit {index + 1} : </p>
                ) : (
                  <p className="popupHeader marginTop">commit :</p>
                )}
              </div>
              <div className={resize ? "col-9" : "col-10"}>
                <EditText
                  className="popupText pl-0"
                  value={commit}
                  onChange={(value) => {
                    commitEdit[index] = value;
                    setCommitEdit([...commitEdit]);
                  }}
                />
              </div>
            </div>
          ))}

          {taskEdit.map((task, index) => (
            <div className="row">
              <div className={resize ? "col-3" : "col-2"}>
                {taskEdit.length > 1 ? (
                  <p className="popupHeader marginTop">taks {index + 1} : </p>
                ) : (
                  <p className="popupHeader marginTop">task :</p>
                )}
              </div>
              <div className={resize ? "col-9" : "col-10"}>
                <EditText
                  className="popupText pl-0"
                  value={task}
                  onChange={(value) => {
                    taskEdit[index] = value;
                    setTaskEdit([...taskEdit]);
                  }}
                />
              </div>
            </div>
          ))}

          {additionEdit.map((addition, index) => (
            <div className="row">
              <div className={resize ? "col-4" : "col-2"}>
                {additionEdit.length > 1 ? (
                  <p className="popupHeader marginTop">
                    additions {index + 1} :{" "}
                  </p>
                ) : (
                  <p className="popupHeader marginTop">additions :</p>
                )}
              </div>
              <div className={resize ? "col-8" : "col-10"}>
                {user.role === "Member" ? (
                  <p className="popupText marginTop">{addition}</p>
                ) : (
                  <EditText
                    className="popupText pl-0"
                    type="number"
                    value={addition}
                    onChange={(value) => {
                      if (value >= 0) {
                        additionEdit[index] = parseInt(value);
                        setAdditionEdit([...additionEdit]);
                      } else {
                        alert("Value must more than or equal 0");
                      }
                    }}
                  />
                )}
              </div>
            </div>
          ))}

          {deletionsEdit.map((deletion, index) => (
            <div className="row">
              <div className={resize ? "col-4" : "col-2"}>
                {deletionsEdit.length > 1 ? (
                  <p className="popupHeader marginTop">
                    deletions {index + 1} :{" "}
                  </p>
                ) : (
                  <p className="popupHeader marginTop">deletions :</p>
                )}
              </div>
              <div className={resize ? "col-8" : "col-10"}>
                {user.role === "Member" ? (
                  <p className="popupText marginTop">{deletion}</p>
                ) : (
                  <EditText
                    className="popupText pl-0"
                    type="number"
                    value={deletion}
                    onChange={(value) => {
                      if (value >= 0) {
                        deletionsEdit[index] = parseInt(value);
                        setdeletionsEdit([...deletionsEdit]);
                      } else {
                        alert("Value must more than or equal 0");
                      }
                    }}
                  />
                )}
              </div>
            </div>
          ))}

          <div className="row">
            <div className={resize ? "col-3" : "col-2"}>
              <p className="popupHeader" style={{ marginTop: "6px" }}>
                Link :
              </p>
            </div>
            <div className={resize ? "col-9" : "col-10"}>
              <EditText
                className="popupText pl-0"
                value={url}
                onChange={(e) => setUrl(e)}
              >
                commit.web_url
              </EditText>
            </div>
          </div>
          <div className="form-group mt-3">
            <label className="popupHeader">Comment: </label>
            <input
              type="text"
              required
              className="form-control"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <button className="popupBtnNoBorder" onClick={handleClose}>
            CANCEL
          </button>
          <div>
            <button className="popupBtn" onClick={onSubmit}>
              ADD
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

export default PopupManualAddReport;
