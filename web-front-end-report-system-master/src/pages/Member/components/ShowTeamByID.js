import React, { useState, useEffect } from "react";
import { useStateValue } from "../../../services/StateProvider";
import AuthAxios from "../../../services/AuthAxios";

function ShowTeamByID(props) {
  const [{ user, jwt }] = useStateValue();
  const [teamName, setTeamName] = useState("");
  const [loading, setLoading] = useState(true);
  //users
  useEffect(() => {
    if (user.role === "Master") {
      fetchTeamByID();
    }
  }, [jwt]);

  const fetchTeamByID = async () => {
    setLoading(true);
    await AuthAxios(jwt)
      .get("/team/" + props.teamid)
      .then((res) => {
        try {
          if (res.data.name === "TokenExpiredError") {
            alert("Token expired");
            window.location = "/";
          } else {
            setTeamName(res.data.teamname);
            setLoading(false);
          }
        } catch (e) {
          console.log(e);
        }
      });
  };
  return <div>{loading ? <p>Loading...</p> : <p>{teamName}</p>}</div>;
}

export default ShowTeamByID;
