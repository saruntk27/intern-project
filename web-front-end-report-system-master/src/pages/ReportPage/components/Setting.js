import React, { useState } from "react";
import SettingsIcon from "@material-ui/icons/Settings";
import "../css/Setting.css";
import PopupSetting from "./Popup/PopupSetting";
import { Spinner } from "react-bootstrap";

function Setting({ handleUpdate, repositoryid, privateToken, teamid }) {
  const [show, setShow] = useState(false);

  const handleClose = () => {
    setShow(false);
  };

  return (
    <>
      {repositoryid !== undefined ? (
        <SettingsIcon
          className="settingIcon"
          onClick={() => setShow(true)}
          handleClose={handleClose}
          show={show}
        />
      ) : (
        <Spinner
          as="span"
          animation="grow"
          size="sm"
          role="status"
          aria-hidden="true"
        />
      )}
      {show && (
        <PopupSetting
          handleClose={handleClose}
          show={show}
          handleUpdate={handleUpdate}
          repositoryid={repositoryid}
          privateToken={privateToken}
          teamid={teamid}
        />
      )}
    </>
  );
}

export default Setting;
