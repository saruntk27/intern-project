import React, { useState, useEffect, useRef } from "react";
import { Divider } from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import ShowTeamByID from "./ShowTeamByID";
import PopupDeleteUser from "./Popup/PopupDeleteUser";
import clsx from "clsx";
import ".././css/MemberRow.css";
import { EditText } from "react-edit-text";
import { useStateValue } from "../../../services/StateProvider";
import AuthAxios from "../../../services/AuthAxios";
import { Spinner } from "react-bootstrap";

function MemberRow(props) {
  const [{ jwt }] = useStateValue();
  const [selectedUser, setSelectedUser] = useState({});
  const [showDeleteUser, setShowDeleteUser] = useState(false);
  const [edit, setEdit] = useState(false);

  const [nameUpdate, setNameUpdate] = useState("");
  const [userNameUpdate, setUserNameUpdate] = useState("");
  const [emailUpdate, setEmailUpdate] = useState("");
  const [phoneUpdate, setPhoneUpdate] = useState("");

  const [roleUpdate, setRoleUpdate] = useState("");
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    setNameUpdate(props.user.fullname);
    setUserNameUpdate(props.user.username);
    setEmailUpdate(props.user.email);
    setPhoneUpdate(props.user.phone);
    setRoleUpdate(props.user.role);
  }, [props.user]);

  const handleDelete = (e, user) => {
    e.preventDefault();
    setSelectedUser(user);
    setShowDeleteUser(true);
  };

  const handleUpdateUser = (e) => {
    e.preventDefault();
    setEdit(true);
  };

  const handleCancelUpdateUser = (e) => {
    e.preventDefault();
    setEdit(false);
  };

  const handleDeleteUserClose = () => {
    setShowDeleteUser(false);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);
    const userUpdate = {
      role: roleUpdate,
      fullname: nameUpdate,
      username: userNameUpdate,
      email: emailUpdate,
      phone: phoneUpdate,
    };
    setUploading(true);
    await AuthAxios(jwt)
      .post("/user/update/" + props.user._id, userUpdate)
      .then((res) => {
        responseUpdateUser(res);
      });
    props.handleUpdate();
  };

  const responseUpdateUser = (res) => {
    if (res.data.error) {
      alert(res.data.error.keyValue.username + " already exist.");
    } else {
      setUploading(false);
    }
  };

  return (
    <>
      {props.user.role !== "Master" ? (
        <div>
          <Divider />
          <div
            className={clsx({
              ShowMemberInfo: !edit,
              ShowMemberInfoEdit: edit,
            })}
          >
            <p style={{ width: "180px" }}>
              {props.user.profile !== "" ? (
                <img
                  src={`${process.env.REACT_APP_URL}/${props.user.profile}`}
                  alt="Avatar"
                  className="avatar"
                ></img>
              ) : (
                <img
                  src={`/img_avatar.png`}
                  alt="Avatar"
                  className="avatar"
                ></img>
              )}
            </p>
            {edit ? (
              <>
                <EditText
                  className="memberEditText pl-0"
                  style={{ width: "240px" }}
                  value={nameUpdate}
                  onChange={(e) => setNameUpdate(e)}
                />
                <EditText
                  className="memberEditText pl-0"
                  style={{ width: "180px" }}
                  value={userNameUpdate}
                  onChange={(e) => setUserNameUpdate(e)}
                />
                <EditText
                  className="memberEditText pl-0"
                  style={{ width: "180px" }}
                  value={emailUpdate}
                  onChange={(e) => setEmailUpdate(e)}
                />
                <EditText
                  className="memberEditText pl-0"
                  style={{ width: "140px" }}
                  value={phoneUpdate}
                  onChange={(e) => setPhoneUpdate(e)}
                />
              </>
            ) : (
              <>
                <p style={{ width: "240px" }}>{props.user.fullname}</p>
                <p style={{ width: "180px" }}>{props.user.username}</p>
                <p style={{ width: "180px" }}>{props.user.email}</p>
                <p style={{ width: "140px" }}>{props.user.phone}</p>
              </>
            )}
            <p style={{ width: "140px" }}>{props.user.role}</p>
            <p style={{ width: "240px" }}>
              <ShowTeamByID teamid={props.user.teamid} />
            </p>
            <div className="ShowMemberEdit">
              {edit ? (
                <>
                  <button
                    className="memberBtnNoBorder"
                    onClick={(e) => handleCancelUpdateUser(e)}
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
                      style={{ marginRight: "5px" }}
                    />
                  ) : (
                    <button className="updteUserSaveBTN" onClick={onSubmit}>
                      <span style={{ margin: "0px 0px 0px 5px" }}>SAVE</span>
                    </button>
                  )}
                </>
              ) : (
                <>
                  <EditIcon
                    style={{
                      color: "#1A4074",
                      marginRight: 15,
                    }}
                    onClick={(e) => handleUpdateUser(e)}
                  />
                  <DeleteIcon
                    style={{
                      color: "#1A4074",
                    }}
                    onClick={(e) => handleDelete(e, props.user)}
                  />
                </>
              )}
            </div>
          </div>
          <PopupDeleteUser
            user={selectedUser}
            handleClose={handleDeleteUserClose}
            show={showDeleteUser}
            handleUpdate={props.handleUpdate}
          />
        </div>
      ) : null}
    </>
  );
}

export default MemberRow;
