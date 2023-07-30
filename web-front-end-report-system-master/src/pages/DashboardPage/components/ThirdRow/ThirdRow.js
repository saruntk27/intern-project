import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import TeamLeader from "./TeamLeader";
import Activity from "./Activity";


const useStyles = makeStyles({
  row: {
    display: "flex",
    flex: 1,
    flexWrap: "wrap",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  rowResize: {
    display: "flex",
    flexWrap: "wrap",
    flexDirection: "row",
    justifyContent: "center",
  },
});

function ThirdRow() {
  const classes = useStyles();
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
    <div className={resize ? classes.rowResize : classes.row}>
      <TeamLeader title={"Team Leader"} />
      <Activity title={"Recent Activity"} />
    </div>
  );
}

export default ThirdRow;
