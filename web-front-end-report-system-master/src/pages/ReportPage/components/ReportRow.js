import React, { useState, useEffect, useRef } from "react";
import { useStateValue } from "../../../services/StateProvider";
import "../css/ShowReports.css";
import { Divider } from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import PopupReport from "./Popup/PopupReport";
import moment from "moment";
import PopupDeleteReport from "./Popup/PopupDeleteReport";
import clsx from "clsx";
import { tr } from "react-dom-factories";

function ReportRow(props) {
  const [{ user }] = useStateValue();
  const [show, setShow] = useState(false);
  const [selectedReport, setSelectedReport] = useState({});

  const [showDeleteReport, setShowDeleteReport] = useState(false);
  const [selectedDeleteReport, setSelectedDeleteReport] = useState({});

  const [test, setTest] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkDeletedUser();
  }, [props.id]);

  const checkDeletedUser = () => {
    setLoading(true);
    for (let i = 0; i < props.usersid.length; i++) {
      if (props.report.userid === props.usersid[i]) {
        setTest(true);
        setLoading(false);
        return;
      }
    }
    setLoading(false);
  };

  const handleClose = () => {
    setShow(false);
  };

  const handleUpdate = () => props.handleUpdate();

  const handleShowPopupReport = (selectedReport) => {
    setShow(true);
    setSelectedReport(selectedReport);
  };

  const handleShowPopupDeleteReport = (selectedReport) => {
    setShowDeleteReport(true);
    setSelectedDeleteReport(selectedReport);
  };

  const handleDeleteReportClose = () => {
    setShowDeleteReport(false);
  };

  return (
    <div>
      {!props.showCommits && (
        <div key={props.i}>
          <Divider />
          <div
            className={
              loading
                ? "ShowReportInfo"
                : user.role === "Master"
                  ? clsx({
                    "ShowReportInfo ShowReportDeletedInfoActive": !test,
                    ShowReportInfo: test,
                  })
                  : "ShowReportInfo"
            }
            onClick={() => handleShowPopupReport(props.report)}
          >
            <p style={{ width: "50px" }}>
              {props.length - props.i}
            </p>
            <p style={{ width: "180px" }}>
              {moment(new Date(props.report.createdAt)).format(
                "MMMM Do YYYY h:mm a"
              )}
            </p>
            <p>{props.report.username}</p>
            <p style={{ width: "240px" }}>
              {props.report.task.map((task) => (
                <>
                  <p>{task}</p>
                  <br></br>
                </>
              ))}
            </p>
            <p style={{ width: "240px" }}>
              {props.report.commits.map((commit) => (
                <>
                  <p>{commit}</p>
                  <br></br>
                </>
              ))}
            </p>
            <p style={{ width: "100px" }}>
              {props.report.additions.map((addition) => (
                <>
                  <p>{addition}</p>
                  <br></br>
                </>
              ))}
            </p>
            <p style={{ width: "100px" }}>
              {props.report.deletetions.map((deletetion) => (
                <>
                  <p>{deletetion}</p>
                  <br></br>
                </>
              ))}
            </p>
            <p style={{ width: "240px" }}>{props.report.comment}</p>
            <div className="ShowReportEdit">
              {user.role === "Leader" || user.role === "Master" ? (
                <DeleteIcon
                  style={{
                    color: "#1A4074",
                    pointerEvents: "visible",
                  }}
                  onMouseEnter={() => handleShowPopupDeleteReport(props.report)}
                />
              ) : null}
            </div>
          </div>
        </div>
      )}

      {show && (
        <PopupReport
          report={selectedReport}
          handleClose={handleClose}
          show={show}
          handleUpdate={handleUpdate}
          i={props.i}
          length={props.length}
        />
      )}

      {showDeleteReport && (
        <PopupDeleteReport
          report={selectedDeleteReport}
          handleClose={handleDeleteReportClose}
          show={showDeleteReport}
          handleUpdate={handleUpdate}
        />
      )}
    </div>
  );
}

export default ReportRow;
