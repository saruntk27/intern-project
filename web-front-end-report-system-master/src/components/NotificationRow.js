import AuthAxios from "../services/AuthAxios";
import React from "react";
import moment from "moment";
import { useStateValue } from "../services/StateProvider";

function NotificationRow(props) {
  const [{ jwt }] = useStateValue();

  const updateRead = async (e) => {
    const notificationUpdate = {
      isRead: true,
    };
    if (props.memberNotification.notification.isRead === false) {
      await AuthAxios(jwt)
        .post(
          "/notification/report/update/" +
            props.memberNotification.notification._id,
          notificationUpdate
        )
        .catch((err) => console.log(err));
      props.handleUpdate();
    }
  };

  return (
    <div className="memberNotification" onClick={updateRead}>
      {props.memberNotification.profile !== "" ? (
        <img
          src={`${process.env.REACT_APP_URL}/${props.memberNotification.profile }`}
          alt="Avatar"
          className="notificationRowProfile"
        ></img>
      ) : (
        <img
          src={`/img_avatar.png`}
          alt="Avatar"
          className="notificationRowProfile"
        ></img>
      )}
      <div className="memberNotification__info">
        <p style={{ wordWrap: "break-word" }}>
          {props.memberNotification.notification.description}
        </p>
        <p style={{ fontSize: "small", color: "black", opacity: 0.7 }}>
          {moment(new Date(props.memberNotification.notification.createdAt))
            .startOf("minute")
            .fromNow()}
        </p>
      </div>
      {/* {read ? null : <div className="notRead"></div>} */}
      {props.memberNotification.notification.isRead === true ? null : (
        <div className="notRead"></div>
      )}
    </div>
  );
}

export default NotificationRow;
