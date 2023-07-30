import React, { useState, useEffect } from "react";
import { useStateValue } from "../../../services/StateProvider";
import AuthAxios from "../../../services/AuthAxios";
import { Divider } from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import ".././css/ShowMember.css";
import AddIcon from "@material-ui/icons/Add";
import PopupDeleteUser from "./Popup/PopupDeleteUser";
import MemberRow from "./MemberRow";
import PopupAddUser from "./Popup/PopupAddUser";
import SortIcon from "@material-ui/icons/Sort";

function ShowMember() {
  const [{ user, jwt }] = useStateValue();
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [showAddUser, setShowAddUser] = useState(false);
  const [updateUser, setUpdateUser] = useState(false);

  //users
  useEffect(() => {
    if (user.role === "Master") {
      fetchUsers();
    }
  }, [jwt, updateUser]);

  const fetchUsers = async () => {
    setUsers([]);
    await AuthAxios(jwt)
      .get("/user")
      .then((res) => {
        try {
          if (res.data.name === "TokenExpiredError") {
            alert("Token expired");
            window.location = "/";
          } else {
            setUsers(res.data);
            setLoading(false);
          }
        } catch (e) {
          console.log(e);
        }
      });
  };

  const handleAddUserClose = () => {
    setShowAddUser(false);
  };

  const handleAddUser = () => setShowAddUser(!showAddUser);

  const handleUpdate = () => setUpdateUser(!updateUser);

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
    <div className="ShowMember">
      <div className="ShowMemberHeader">
        <div className="ShowMemberFilter">
          {user.role === "Master" && (
            <>
              <button
                className="addReportBtn"
                style={{ width: "175px" }}
                onClick={(e) => handleAddUser()}
              >
                <AddIcon></AddIcon>
                <span style={{ margin: "0px 0px 0px 5px" }}>
                  Add new member
                </span>
              </button>
              <SortIcon
                color="primary"
                style={{ marginLeft: "20px" }}
              ></SortIcon>
            </>
          )}
        </div>
        <div className="ShowMemberPage"></div>
      </div>
      <div className="ShowMemberBody">
        <div className="ShowMemberRow">
          <div
            className="ShowMemberHeaderInfo"
            style={{ marginBottom: "10px" }}
          >
            <p className="report_HeaderText" style={{ width: "180px" }}>
              Photo
            </p>
            <p className="report_HeaderText" style={{ width: "240px" }}>
              Name
            </p>

            <p className="report_HeaderText" style={{ width: "180px" }}>
              Username
            </p>
            <p className="report_HeaderText" style={{ width: "180px" }}>
              Email
            </p>
            <p className="report_HeaderText" style={{ width: "140px" }}>
              Phone Number
            </p>
            <p className="report_HeaderText" style={{ width: "140px" }}>
              Role Status
            </p>
            <p className="report_HeaderText" style={{ width: "240px" }}>
              Current Team
            </p>
            <div style={{ width: "180px" }}></div>
          </div>
          <Divider />
        </div>

        {loading ? (
          <div>
            <Divider />
            <div className={"ShowMemberInfo"}>
              <p style={{ width: "180px" }}>Loading...</p>
              <p style={{ width: "240px" }}>Loading...</p>
              <p style={{ width: "180px" }}>Loading...</p>
              <p style={{ width: "180px" }}>Loading...</p>
              <p style={{ width: "140px" }}>Loading...</p>
              <p style={{ width: "140px" }}>Loading...</p>
              <p style={{ width: "240px" }}>Loading...</p>
              <div className="ShowMemberEdit">
                <DeleteIcon
                  style={{
                    color: "#1A4074",
                    pointerEvents: "visible",
                  }}
                />
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className={resize ? null : "ShowMemberWrapper"}>
              {users.map((user, index) => (
                <>
                  <MemberRow
                    user={user}
                    handleUpdate={handleUpdate}
                    index={index}
                  />
                </>
              ))}
            </div>
          </>
        )}

        {!loading && users.length === 1 ? (
          <p className="noReport">Don't have any members</p>
        ) : null}

        <PopupAddUser
          handleClose={handleAddUserClose}
          show={showAddUser}
          handleUpdate={handleUpdate}
        />
      </div>
    </div>
  );
}

export default ShowMember;
