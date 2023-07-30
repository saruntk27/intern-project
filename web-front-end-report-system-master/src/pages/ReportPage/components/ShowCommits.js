import React, { useState, useEffect } from "react";
import { Divider } from "@material-ui/core";
import AuthAxios from "../../../services/AuthAxios";
import PopupCommit from "./Popup/PopupCommit";
import "../css/Commit.css";
import clsx from "clsx";
import moment from "moment";

function ShowCommits(props) {
  const [commit, setCommit] = useState({});
  const [task, setTask] = useState("");
  const [additions, setAdditions] = useState("");
  const [deletions, setDeletions] = useState("");
  const [created_at, setCreated_at] = useState("");
  const [show, setShow] = useState(false);
  const [selectedCommit, setSelectedCommit] = useState({});
  const [loading, setLoading] = useState(true);

  const [test, setTest] = useState(false);

  useEffect(() => {
    fetchCommit();
  }, [props.id]);

  const fetchCommit = async () => {
    setLoading(true);
    await AuthAxios(props.jwt)
      .get(
        `/gitlab/commit/${props.id}/${props.repositoryid}/${localStorage.getItem("privateToken")}`
      )
      .then((res) => {
        setCommit(res.data);
        setTask(
          res.data.message
            .slice(res.data.title.length, res.data.message.length)
            .trim()
        );
        setAdditions(res.data.stats.additions);
        setDeletions(res.data.stats.deletions);
        setCreated_at(res.data.created_at);
        setLoading(false);
        for (let i = 0; i < props.commitsid.length; i++) {
          if (res.data.id === props.commitsid[i]) {
            setTest(true);
            // props.commitsid.splice(i, 1);
            return;
          }
        }
      })
      .catch((err) => console.log(err));
  };

  const handleShow = (selectedCommit) => {
    setShow(true);
    setSelectedCommit(selectedCommit);
  };

  const handleClose = () => setShow(false);

  return (
    <>
      {commit && (
        <>
          <Divider />
          <div
            className={clsx({
              "ShowReportInfo ShowReportInfoActive": test,
              ShowReportInfo: !test,
            })}
            onClick={() => handleShow(commit)}
          >
            <p style={{ width: "180px" }}>
              {loading
                ? "Loading..."
                : moment(new Date(created_at)).format("MMMM Do YYYY h:mm a")}
            </p>
            <p>{commit.author_name}</p>
            <p style={{ width: "240px" }}>{task}</p>
            <p style={{ width: "240px" }}>{commit.title}</p>
            <p style={{ width: "100px" }}>{additions}</p>
            <p style={{ width: "100px" }}>{deletions}</p>
            {props.showCommits ? null : <p style={{ width: "240px" }}></p>}
            <div className="ShowReportEdit"></div>
          </div>
          {show && (
            <PopupCommit
              commit={selectedCommit}
              task={task}
              additions={additions}
              deletions={deletions}
              handleClose={handleClose}
              show={show}
              member={props.member}
              memberid={props.memberid}
              fcm={props.fcm}
              handleAddCommit={props.handleAddCommit}
            />
          )}
        </>
      )}
    </>
  );
}

export default ShowCommits;
