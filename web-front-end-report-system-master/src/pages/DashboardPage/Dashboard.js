import React from "react";
import FirstLow from "./components/FirstRow/FirstRow";
import SecondRow from "./components/SecondRow/SecondRow";
import ThirdRow from "./components/ThirdRow/ThirdRow";

function Dashboard() {
  return (
    <div>
      <FirstLow />
      <SecondRow />
      <ThirdRow />
    </div>
  );
}

export default Dashboard;
