import React, { useState, useEffect } from "react";
import { Modal, Spinner } from "react-bootstrap";
import "../../css/PopupAddUser.css";
import AuthAxios from "../../../../services/AuthAxios";
import { useStateValue } from "../../../../services/StateProvider";
import { Divider } from "@material-ui/core";
import axios from "axios";
import AddAPhotoIcon from "@material-ui/icons/AddAPhoto";

function PopupAddUser(props) {
  const [{ jwt }] = useStateValue();
  const [uploading, setUploading] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setfirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const [usernameErr, setUsernameErr] = useState({});
  const [passwordErr, setPasswordErr] = useState({});
  const [firstNameErr, setfirstNameErr] = useState({});
  const [lastNameErr, setLastNameErr] = useState({});
  const [emailErr, setEmailErr] = useState({});
  const [phoneErr, setPhoneErr] = useState({});
  const [member, setMember] = useState({});

  //photo
  const [showPreview, setShowPreview] = useState(false);
  const [preview, setPreview] = useState("");
  const [image, setImage] = useState(null);

  useEffect(() => {
    setUsernameErr({});
    setPasswordErr({});
    setfirstNameErr({});
    setLastNameErr({});
    setEmailErr({});
    setPhoneErr({});
    setMember({});
    resetInput();
  }, [props.show]);

  const handleFileChange = async (e) => {
    e.preventDefault();
    if (e.target.files[0]) {
      if (e.target.files[0].type.includes("image")) {
        const objectUrl = URL.createObjectURL(e.target.files[0]);
        setShowPreview(true);
        setPreview(objectUrl);
        setImage(e.target.files[0]);
      } else {
        alert("Please selecte only image file.");
      }
    }
  };

  const handleUpload = async () => {
    if (image !== null) {
      const formData = new FormData();
      formData.append("image", image);
      await axios
        .create({
          baseURL: process.env.REACT_APP_URL,
          headers: {
            "x-auth-token": jwt,
            "content-type": "multipart/form-data",
          },
        })
        .post("/upload/image", formData)
        .then((res) => {
          try {
            if (res.data.name === "TokenExpiredError") {
              alert("Token expired");
              window.location = "/";
            } else {
              addNewUser(res.data.filename);
            }
          } catch (e) {
            console.log(e);
          }
        })
        .catch((err) => console.log(err));
    } else {
      addNewUser("");
    }
  };

  const addNewUser = async (profileImage) => {
    const newUser = {
      username: username,
      password: password,
      role: "",
      teamid: "",
      profile: profileImage,
      email: email,
      phone: phone,
      fullname: firstName + " " + lastName,
    };
    await AuthAxios(jwt)
      .post("/user/add", newUser)
      .then((res) => {
        if (res.data.error.keyValue.username) {
          alert(res.data.error.keyValue.username + " already exist.");
        }
        resetInput();
      })
      .catch((err) => console.log(err));

    setUploading(false);
    props.handleClose();
    props.handleUpdate();
  };

  const resetInput = () => {
    setUsername("");
    setPassword("");
    setfirstName("");
    setLastName("");
    setEmail("");
    setPhone("");
    setShowPreview(false);
    setPreview("");
    setImage(null);
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    setMember(() => [
      {
        username: username,
        password: password,
        firstName: firstName,
        lastName: lastName,
        email: email,
        phone: phone,
      },
    ]);

    const isValid = formValidation();
    if (isValid) {
      setUsername("");
      setPassword("");
      setfirstName("");
      setLastName("");
      setEmail("");
      setPhone("");
      setUploading(true);
      handleUpload();
    }
  };

  const formValidation = () => {
    const usernameErr = {};
    const passwordErr = {};
    const firstNameErr = {};
    const lastNameErr = {};
    const emailErr = {};
    const phoneErr = {};

    let isValid = true;

    if (username.trim().length < 1) {
      usernameErr.usernamerequired = "Please enter your username.";
      isValid = false;
    }
    if (password.trim().length < 1) {
      passwordErr.passwordrequired = "Please enter your password.";
      isValid = false;
    } else if (password.trim().length < 6) {
      passwordErr.passwordrequired = "Password must has at least 6 characters.";
      isValid = false;
    }
    if (firstName.trim().length < 1) {
      firstNameErr.firstNamerequired = "Please enter your firstName.";
      isValid = false;
    }
    if (lastName.trim().length < 1) {
      lastNameErr.lastNamerequired = "Please enter your lastName.";
      isValid = false;
    }
    // var validemail = /^[a-zA-Z0-9]+[@]+[a-z]+[.]+[a-z]$/;

    const re =
      /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

    if (!re.test(email)) {
      emailErr.emailrequired = "email required please try again.";
      isValid = false;
    } else if (email.trim().length < 1) {
      emailErr.emailrequired = "Please enter your email address.";
      isValid = false;
    }

    if (phone.trim().match(/[^0-9]$/)) {
      phoneErr.phonerequired = "Please enter only number";
      isValid = false;
    } else if (phone.trim().length < 1) {
      phoneErr.phonerequired = "Please enter your phone number.";
      isValid = false;
    } else if (phone.trim().length < 9) {
      phoneErr.phonerequired = "Phone number must has at least 9 numbers.";
      isValid = false;
    } else if (phone.trim().length !== 10) {
      phoneErr.phonerequired = "Phone number must has at most 10 numbers.";
      isValid = false;
    }

    setUsernameErr(usernameErr);
    setPasswordErr(passwordErr);
    setfirstNameErr(firstNameErr);
    setLastNameErr(lastNameErr);
    setEmailErr(emailErr);
    setPhoneErr(phoneErr);

    return isValid;
  };

  return (
    <div>
      <Modal
        size="lg"
        show={props.show}
        onHide={props.handleClose}
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Body className="pupupCommit__wraper">
          <div className="popupAddUser__Body">
            <div className="popupAddUser__BodyLeft">
              <form id="test_form" method="GET" action="">
                {showPreview ? (
                  <img src={preview} alt="" className="popupAddUser__Image" />
                ) : (
                  <label id="pic1" className="AddUserlabel">
                    <AddAPhotoIcon
                      style={{
                        fontSize: 40,
                        marginTop: "-8px",
                        marginLeft: "-2px",
                      }}
                    />
                    <input
                      type="file"
                      name="image"
                      id="fileToUpload"
                      size="1"
                      onChange={(e) => handleFileChange(e)}
                    />
                  </label>
                )}
              </form>
            </div>
            <div className="popupAddUser__BodyRight">
              <div className="row popupAddUser__rowForm">
                <div className="col-12">
                  <p className="popUpAddUser__Text">User Name</p>
                  <form>
                    <input
                      className="popupAddUser__input"
                      type="text"
                      placeholder="username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    ></input>
                    {Object.keys(usernameErr).map((key) => {
                      return (
                        <div style={{ fontSize: 12, color: "red" }}>
                          {usernameErr[key]}
                        </div>
                      );
                    })}
                  </form>
                </div>
              </div>
              <div className="row popupAddUser__rowForm">
                <div className="col-12">
                  <p className="popUpAddUser__Text">Password</p>
                  <input
                    className="popupAddUser__input"
                    type="password"
                    placeholder="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  ></input>
                  {Object.keys(passwordErr).map((key) => {
                    return (
                      <div style={{ fontSize: 12, color: "red" }}>
                        {passwordErr[key]}
                      </div>
                    );
                  })}
                </div>
              </div>
              <Divider style={{ margin: "24px 0px 16px 0px", opacity: 1 }} />
              <div
                className="row popupAddUser__rowForm"
                style={{ marginTop: "0px" }}
              >
                <div className="col-6">
                  <p className="popUpAddUser__Text">Firstname</p>
                  <input
                    className="popupAddUser__input"
                    type="text"
                    placeholder="Firstname"
                    value={firstName}
                    onChange={(e) => setfirstName(e.target.value)}
                  ></input>{" "}
                  {Object.keys(firstNameErr).map((key) => {
                    return (
                      <div style={{ fontSize: 12, color: "red" }}>
                        {firstNameErr[key]}
                      </div>
                    );
                  })}
                </div>
                <div className="col-6">
                  <p className="popUpAddUser__Text">Lastname</p>
                  <input
                    className="popupAddUser__input"
                    type="text"
                    placeholder="Lastname"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  ></input>
                  {Object.keys(lastNameErr).map((key) => {
                    return (
                      <div style={{ fontSize: 12, color: "red" }}>
                        {lastNameErr[key]}
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="row popupAddUser__rowForm">
                <div className="col-6">
                  <p className="popUpAddUser__Text">Email</p>
                  <input
                    className="popupAddUser__input"
                    type="text"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  ></input>{" "}
                  {Object.keys(emailErr).map((key) => {
                    return (
                      <div style={{ fontSize: 12, color: "red" }}>
                        {emailErr[key]}
                      </div>
                    );
                  })}
                </div>
                <div className="col-6">
                  <p className="popUpAddUser__Text">Mobile Number</p>
                  <input
                    className="popupAddUser__input"
                    type="text"
                    placeholder="Mobile Number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  ></input>
                  {Object.keys(phoneErr).map((key) => {
                    return (
                      <div style={{ fontSize: 12, color: "red" }}>
                        {phoneErr[key]}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
          <div
            className="popupAddUser__Bottom"
            style={{ marginTop: "80px", marginBottom: "15px" }}
          >
            <button
              className="popupBtnNoBorder"
              onClick={props.handleClose}
              style={{ marginRight: 10 }}
            >
              CANCEL
            </button>
            <div>
              {uploading ? (
                <Spinner
                  as="span"
                  animation="grow"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                  style={{ marginRight: "5px" }}
                />
              ) : (
                <button className="popupBtnAdduser" onClick={onSubmit}>
                  ADD
                </button>
              )}
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default PopupAddUser;
