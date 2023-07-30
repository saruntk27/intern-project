import React, { useState, useEffect } from "react";
import { Button, Modal, Spinner } from "react-bootstrap";
import AuthAxios from "../../../../services/AuthAxios";
import { EditText } from "react-edit-text";
import "react-edit-text/dist/index.css";
import { useStateValue } from "../../../../services/StateProvider";
import moment from "moment";
import "../../css/PopupReport.css";

function PopupReport({ report, handleClose, show, handleUpdate, i, length }) {
  const [{ user, jwt }] = useStateValue();
  const [tasks, setTasks] = useState([]);
  const [commits, setCommits] = useState([]);
  const [additions, setAdditions] = useState([]);
  const [deletetions, setDeletetions] = useState([]);
  const [comment, setComment] = useState("");
  const [username, setUsername] = useState("");
  const [web_url, setWeb_url] = useState("");
  const [createdAt, setCreatedAt] = useState("");
  const [committed_date, setCommitted_date] = useState("");

  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    setTasks(report.task);
    setCommits(report.commits);
    setAdditions(report.additions);
    setDeletetions(report.deletetions);
    setComment(report.comment);
    setUsername(report.username);
    setWeb_url(report.web_url);
    setCreatedAt(report.createdAt);
    setCommitted_date(report.committed_date);
  }, [report]);

  const onSubmit = async (e) => {
    e.preventDefault();
    const updateReport = {
      task: tasks,
      commits: commits,
      additions: additions,
      deletetions: deletetions,
      comment: comment,
      leadername: user.username,
      leaderid: user._id,
      username: username,
      userid: report.userid,
      commitid: report.commitid,
      web_url: web_url,
      committed_date: committed_date,
    };
    setUploading(true);
    await AuthAxios(jwt)
      .post("/report/update/" + report._id, updateReport)
      .then((res) => responseAddReport(res));
  };

  const responseAddReport = (res) => {
    if (res.data.error) {
      alert(res.data.error);
    }
    setUploading(false);
    handleUpdate();
    handleClose();
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
            <Modal.Title>Report {length - i} : {username}</Modal.Title>
            <p className="popupText">
              Added report :{" "}
              {moment(new Date(createdAt)).format("MMMM Do YYYY h:mm a")}
            </p>
            <p className="popupText">
              Committed :{" "}
              {committed_date !== "" ? (
                <>
                  {moment(new Date(committed_date)).format(
                    "MMMM Do YYYY h:mm a"
                  )}
                </>
              ) : null}
            </p>
          </div>
        </Modal.Header>
        <Modal.Body className="pupupReport__wraper">
          <div className="row">
            <div className={resize ? "col-4" : "col-2"}>
              <p className="popupHeader">member :</p>
            </div>
            <div className={resize ? "col-8" : "col-10"}>
              <p className="popupText">{username}</p>
            </div>
          </div>

          {tasks.map((task, index) => (
            <div className="row">
              <div className={resize ? "col-4" : "col-2"}>
                {tasks.length > 1 ? (
                  <p className="popupHeader marginTop">task {index + 1} : </p>
                ) : (
                  <p className="popupHeader marginTop">task :</p>
                )}
              </div>
              <div className={resize ? "col-8" : "col-10"}>
                {user.role === "Member" ? (
                  <p className="popupText marginTop">{task}</p>
                ) : (
                  <EditText
                    className="popupText pl-0"
                    value={task}
                    onChange={(value) => {
                      tasks[index] = value;
                      setTasks([...tasks]);
                    }}
                  />
                )}
              </div>
            </div>
          ))}

          {commits.map((commit, index) => (
            <div className="row">
              <div className={resize ? "col-4" : "col-2"}>
                {commits.length > 1 ? (
                  <p className="popupHeader marginTop">commit {index + 1} : </p>
                ) : (
                  <p className="popupHeader marginTop">commit :</p>
                )}
              </div>
              <div className={resize ? "col-8" : "col-10"}>
                {user.role === "Member" ? (
                  <p className="popupText marginTop">{commit}</p>
                ) : (
                  <EditText
                    className="popupText pl-0"
                    value={commit}
                    onChange={(value) => {
                      commits[index] = value;
                      setCommits([...commits]);
                    }}
                  />
                )}
              </div>
            </div>
          ))}

          {additions.map((addition, index) => (
            <div className="row">
              <div className={resize ? "col-4" : "col-2"}>
                {additions.length > 1 ? (
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
                        additions[index] = parseInt(value);
                        setAdditions([...additions]);
                      } else {
                        alert("Value must more than or equal 0");
                      }
                    }}
                  />
                )}
              </div>
            </div>
          ))}
          {deletetions.map((deletion, index) => (
            <div className="row">
              <div className={resize ? "col-4" : "col-2"}>
                {deletetions.length > 1 ? (
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
                        deletetions[index] = parseInt(value);
                        setDeletetions([...deletetions]);
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
            <div className={resize ? "col-4" : "col-2"}>
              <p className="popupHeader">Link :</p>
            </div>
            <div className={resize ? "col-8" : "col-10"}>
              <a
                rel="noopener noreferrer"
                href={web_url}
                target="_blank"
                style={{ wordWrap: "break-word" }}
              >
                {web_url}
              </a>
            </div>
          </div>
          <div className="row">
            <div className={resize ? "col-4" : "col-2"}>
              <p className="popupHeader marginTop">Comment :</p>
            </div>
            <div className={resize ? "col-8" : "col-10"}>
              {user.role === "Member" ? (
                <p className="popupText marginTop">{comment}</p>
              ) : (
                <EditText
                  className="popupText pl-0"
                  value={comment}
                  onChange={(e) => setComment(e)}
                />
              )}
            </div>
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
              <>
                {user.role === "Master" || user.role === "Leader" ? (
                  <button className="popupBtn" onClick={onSubmit}>
                    UPDATE
                  </button>
                ) : null}
              </>
            )}
          </div>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default PopupReport;
