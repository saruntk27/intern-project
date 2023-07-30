import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import clsx from "clsx";

const useStyles = makeStyles({
  root: {
    width: 378,
    height: 227,
    boxShadow: '0px 3px 6px #00000029',
    borderRadius: 20,
    opacity: 1,
    marginBottom: 30,
    padding: '5px 25px 0px 25px'
  },
  bullet: {
    display: "inline-block",
    margin: "0 2px",
    transform: "scale(0.8)",
  },
  title: {
    fontSize: 24,
    fontWeight: "400",
  },
  subTitle: {
    display: "flex",
    flex: 1,
    fontSize: 20,
    fontWeight: "300",
    justifyContent: "space-between",
  },
  pos: {
    marginBottom: 12,
  },
  white: {
    color: "#FFFFFF",
  },
  body: {
    display: "flex",
    marginTop: "10px",
    marginBottom: "17px",
    height: 80,
  },
  body_left: {
    display: "flex",
    flex: 0.9,
    alignItems: "center",
  },
  body_right: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    textAlign: "right",
    flex: 0.2,
    fontSize: 72,
  },
  totalCount: {
    marginRight: "6px",
  },
});

function DashboardCard(props) {
  const classes = useStyles();
  
  return (
    <Card
      className={clsx(classes.root, classes.white)}
      style={{
        background: `linear-gradient(45deg, ${props.startColor} 10%, ${props.endColor} 90%)`,
      }}
    >
      <CardContent>
        <Typography
          className={clsx(classes.title, classes.white)}
          color="textSecondary"
          gutterBottom
        >
          {props.title}
        </Typography>
        <Typography variant="h5" component="h2" className={classes.body}>
          <Typography variant="h5" component="h2" className={classes.body_left}>
            {props.teams && props.teams}
            {props.Icon && props.Icon}
          </Typography>
          <Typography
            variant="h5"
            component="h2"
            className={classes.body_right}
          >
            {props.monthCount}
          </Typography>
        </Typography>
        <Typography
          className={clsx(classes.subTitle, classes.white)}
          color="textSecondary"
          gutterBottom
        >
          {props.subtitle ? props.subtitle : <div></div>}
          {props.subtitle && (
            <div className={classes.totalCount}>{props.totalCount}</div>
          )}
        </Typography>
      </CardContent>
    </Card>
  );
}

export default DashboardCard;
