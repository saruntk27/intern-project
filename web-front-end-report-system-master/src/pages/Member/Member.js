import React from "react";
import { useStateValue } from "../../services/StateProvider";
import ShowMember from "./components/ShowMember";
import "./css/Member.css";

function Member() {
  const [{ user }] = useStateValue();

  return (
    <>
      {user !== null ? (
        <div className="MemberContainer">
          <ShowMember/>
        </div>
      ) : null}
    </>
  );
}

export default Member;
