import React from "react";
import ShowReport from "./components/ShowReports";
import "./css/Report.css";
import { useStateValue } from "../../services/StateProvider";

function Reports() {
  const [{ user }] = useStateValue();

  return (
    <>
      {user !== null ? (
        <div className="ReportContainer">
          <div className="leftColor" />
          <ShowReport />
        </div>
      ) : null}
    </>
  );
}

export default Reports;
