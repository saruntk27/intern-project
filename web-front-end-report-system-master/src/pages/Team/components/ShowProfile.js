import React, { useState, useEffect } from "react";
import { useStateValue } from "../../../services/StateProvider";
import AuthAxios from "../../../services/AuthAxios";
import "../css/ShowProfile.css";

function ShowProfile({ id }) {
  const [{ jwt }] = useStateValue();
  const [user, setUser] = useState({});

  useEffect(() => {
    fetchProfile();
  }, [jwt]);

  const fetchProfile = async () => {
    await AuthAxios(jwt)
      .get(`/user/${id}`)
      .then((res) => {
        try {
          if (res.data.name === "TokenExpiredError") {
            alert("Token expired");
            window.location = "/";
          } else {
            setUser(res.data);
          }
        } catch (e) {
          console.log(e);
        }
      });
  };

  return (
    <div>
      {user.profile !== "" ? (
        <img
          src={`${process.env.REACT_APP_URL}/${user.profile}`}
          alt="Avatar"
          className="avatar"
          style={{ marginLeft: "-10px" }}
        ></img>
      ) : (
        <img
          src={`/img_avatar.png`}
          alt="Avatar"
          className="avatar"
          style={{ marginLeft: "-10px" }}
        ></img>
      )}
    </div>
  );
}

export default ShowProfile;
