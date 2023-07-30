import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import clsx from "clsx";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";

const useStyles = makeStyles({
  root: {
    width: 378,
    height: 361,
    background: `#FFFFFF`,
    boxShadow: "0px 3px 6px #00000029",
    borderRadius: 20,
    opacity: 1,
    marginBottom: 30,
    padding: "5px 25px 0px 25px",
  },
  title: {
    display: "flex",
    justifyContent: "center",
    fontSize: 24,
    fontWeight: "400",
    opacity: 0.87,
  },
  subTitle: {
    display: "flex",
    flex: 1,
    fontSize: 16,
    fontWeight: "300",
    justifyContent: "center",
    opacity: 0.6,
    marginTop: "24px",
  },
  fontColor: {
    color: "#000000",
  },
  body: {
    marginTop: "20px",
    display: "flex",
    marginBottom: "15px",
    justifyContent: "center",
    textAlign: "center",
    height: 191,
  },
});

function Progress(props) {
  const classes = useStyles();
  const [dx, setDX] = useState(0);

  useEffect(() => {
    if (props.percent >= 100) {
      setDX(-26);
    } else if (props.percent < 10) {
      setDX(-16);
    } else {
      setDX(-20);
    }
  }, [props.percent]);

  const ProgressProvider = ({ valueStart, valueEnd, children }) => {
    const [value, setValue] = useState(valueStart);
    useEffect(() => {
      setValue(valueEnd);
    }, [valueEnd]);

    return children(value);
  };

  return (
    <Card className={clsx(classes.root, classes.fontColor)}>
      <CardContent>
        <Typography
          className={clsx(classes.title, classes.fontColor)}
          color="textSecondary"
          gutterBottom
        >
          {props.title}
        </Typography>
        <Typography variant="h5" component="h2" className={classes.body}>
          <ProgressProvider valueStart={0} valueEnd={props.percent}>
            {(value) => (
              <CircularProgressbar
                minValue={0}
                value={value}
                text={
                  <tspan
                    dy={8}
                    dx={dx}
                    style={{ fontWeight: "bold" }}
                  >{`${value}%`}</tspan>
                }
                styles={buildStyles({
                  rotation: 0,
                  strokeLinecap: "round",
                  textSize: "24px",
                  pathTransitionDuration: 1.5,
                  pathColor: `#0079B6`,
                  textColor: "#828282D9",
                  trailColor: "#EFEFEF",
                })}
              />
            )}
          </ProgressProvider>
        </Typography>
        <Typography
          className={clsx(classes.subTitle, classes.fontColor)}
          color="textSecondary"
          gutterBottom
        >
          {props.subtitle && props.subtitle}
        </Typography>
      </CardContent>
    </Card>
  );
}

export default Progress;
