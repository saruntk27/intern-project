import React, { useState, useEffect } from "react";
import { Button, Modal, Spinner } from "react-bootstrap";
import AuthAxios from "../../../../services/AuthAxios";
import { useStateValue } from "../../../../services/StateProvider";
import "../../css/Popup.css";
import { EditText } from "react-edit-text";
import moment from "moment";

function PopupCommit({
  commit,
  task,
  additions,
  deletions,
  handleClose,
  show,
  member,
  memberid,
  fcm,
  handleAddCommit,
}) {
  const [{ user, jwt }] = useStateValue();
  const [commitEdit, setCommitEdit] = useState([]);
  const [taskEdit, setTaskEdit] = useState([]);
  const [additionEdit, setAdditionEdit] = useState(0);
  const [deletionsEdit, setdeletionsEdit] = useState(0);
  const [comment, setComment] = useState("");
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    setCommitEdit(commit.title.split("\n").filter((x) => x)); //split and filter empty string
    setTaskEdit(task.split("\n").filter((x) => x));
    setAdditionEdit(additions);
    setdeletionsEdit(deletions);
  }, [commit]);

  const onSubmit = async (e) => {
    e.preventDefault();

    const report = {
      task: taskEdit,
      commits: commitEdit,
      additions: [parseInt(additionEdit)],
      deletetions: [parseInt(deletionsEdit)],
      comment: comment,
      leadername: user.username,
      leaderid: user._id,
      username: member,
      userid: memberid,
      commitid: commit.id,
      web_url: commit.web_url,
      committed_date: commit.committed_date,
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
        handleClose();
        setUploading(false);
        handleAddCommit();
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
            <Modal.Title>Add report to : {member}</Modal.Title>
            {commit && (
              <p className="popupText">
                committed date :{" "}
                {moment(new Date(commit.committed_date)).format(
                  "MMMM Do YYYY h:mm a"
                )}
              </p>
            )}
          </div>
        </Modal.Header>
        <Modal.Body className="pupupCommit__wraper">
          <div className="row">
            <div className={resize ? "col-3" : "col-2"}>
              <p className="popupHeader">committer :</p>
            </div>
            <div className={resize ? "col-9" : "col-10"}>
              <p className="popupText">{commit.author_name}</p>
            </div>
          </div>
          <div className="row">
            <div className={resize ? "col-3" : "col-2"}>
              <p className="popupHeader" style={{ marginTop: "6px" }}>
                commit :
              </p>
            </div>
            <div className={resize ? "col-9" : "col-10"}>
              <EditText
                className="popupText pl-0"
                value={commitEdit}
                onChange={(e) => setCommitEdit(e)}
              />
            </div>
          </div>

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

          <div className="row">
            <div className={resize ? "col-3" : "col-2"}>
              <p className="popupHeader" style={{ marginTop: "6px" }}>
                additions :
              </p>
            </div>
            <div className={resize ? "col-9" : "col-10"}>
              <EditText
                className="popupText pl-0"
                type="number"
                value={additionEdit}
                onChange={(e) => setAdditionEdit(e)}
              />
            </div>
          </div>
          <div className="row">
            <div className={resize ? "col-3" : "col-2"}>
              <p className="popupHeader" style={{ marginTop: "6px" }}>
                deletions :
              </p>
            </div>
            <div className={resize ? "col-9" : "col-10"}>
              <EditText
                className="popupText pl-0"
                type="number"
                value={deletionsEdit}
                onChange={(e) => setdeletionsEdit(e)}
              />
            </div>
          </div>
          <div className="row">
            <div className={resize ? "col-3" : "col-2"}>
              <p className="popupHeader">Link :</p>
            </div>
            <div className={resize ? "col-9" : "col-10"}>
              <a
                rel="noopener noreferrer"
                href={commit.web_url}
                target="_blank"
                style={{ wordWrap: "break-word" }}
              >
                {commit.web_url}
              </a>
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
            ) : (
              <button className="popupBtn" onClick={onSubmit}>
                ADD
              </button>
            )}
          </div>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default PopupCommit;
