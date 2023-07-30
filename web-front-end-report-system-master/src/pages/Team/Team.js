import React from "react";
import { useStateValue } from "../../services/StateProvider";
import ShowTeam from "./components/ShowTeam";
import "./css/Team.css";

function Team() {
const [{ user }] = useStateValue();

  return (
    <>
      {user !== null ? (
        <div className="MemberContainer">
          <ShowTeam/>
        </div>
      ) : null}
    </>
  );
}

export default Team;
