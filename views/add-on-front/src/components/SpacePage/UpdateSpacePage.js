import React, { useState, useEffect } from "react";
import { useLocation } from "react-router";
import axios from "axios";
import { useNavigate } from "react-router";
import "react-responsive-modal/styles.css";
import { Modal } from "react-responsive-modal";
import "../../styles/project.css";
import Select from "react-select";

export default function UpdateSpacePage() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [spacePage, setspacePage] = useState();
  const [name, setName] = useState();
  const [key, setKey] = useState();
  const [description, setDescription] = useState();
  const [spaceParameter, setSpaceParameter] = useState();
  const [text, setText] = useState();
  const [select, setSelect] = useState(null);
  const [tag, setTag] = useState();
  const [image, setImage] = useState();
  const [checkBox, setCheckBox] = useState(null);

  const spaceOptions = [
    { value: "Text", label: "Text" },
    { value: "Tag", label: "Tag" },
    { value: "CheckBox", label: "CheckBox" },
    { value: "Select", label: "Select" },
    { value: "Image", label: "Image" },
    { value: "Date", label: "Date" },
    { value: "User", label: "User" }


  ];
  const onOpenModal = () => {
    return setOpen(true);
  };

  const onCloseModal = () => {
    setOpen(false);
  };
  const getspacePage = async () => {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
      withCredentials: true,
    };
    try {
      const { data } = await axios.get(
        `http://${
          process.env.REACT_APP_IP_ADDRESS
        }:5000/api/pfe/user/projects/spacePages/${
          location.pathname.split("/")[2]
        }/${location.pathname.split("/")[4]}`,
        config
      );
      console.log(data.data.spacePage);
      setspacePage(data.data.spacePage);
    } catch (error) {
      console.log(error.response.data.error.message);
    }
  };

  function refreshPage() {
    window.location.reload(false);
  }

  const updatespacePage = async () => {
    var arr = [];

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
      withCredentials: true,
    };
    try {
      spaceParameter && spaceParameter.map((el) => arr.push(el.value));
      var input = { name, key, description };
      arr && (input.paramter = arr);
      text && (input.text = text);
      image && (input.image = image);
      checkBox && (input.checkBox = checkBox);
      tag && (input.tag = tag);

      select && (input.select = select);
      console.log(input);
      const { data } = await axios.patch(
        `http://${
          process.env.REACT_APP_IP_ADDRESS
        }:5000/api/pfe/user/projects/spacePages/${
          location.pathname.split("/")[2]
        }/${location.pathname.split("/")[4]}`,
        input,
        config
      );
      console.log(data);
      refreshPage();
    } catch (error) {
      console.log(error.response.data.error);
    }
  };

  useEffect(() => {
    if (!localStorage.getItem("authToken")) {
      navigate("/auth");
    }

    getspacePage();
  }, []);
  return (
    <>
      <Modal open={open} onClose={onCloseModal} center>
        <form className="sign-in-form">
          <h2 className="title">Update Space Setting </h2>
          <div className="input-field">
            <i className="fas fa-user"></i>
            <input
              type="text"
              placeholder="name"
              defaultValue={spacePage && spacePage.name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="input-field">
            <i className="fas fa-user"></i>
            <input
              type="text"
              placeholder="key"
              defaultValue={spacePage && spacePage.key}
              onChange={(e) => setKey(e.target.value)}
            />
          </div>

          <div className="input-field">
            <i className="fas fa-user"></i>
            <Select
              isMulti
              defaultValue={spaceParameter}
              onChange={setSpaceParameter}
              options={spaceOptions}
            />
          </div>
          {spaceParameter &&
            spaceParameter.map((el) => (
              (el.value==="Date"||el.value==="User")?" ":
              (<div className="input-field">
              <i className="fas fa-user"></i>
              {el.value === "Text" && (
                <input
                  type="text"
                  placeholder={el.value}
                  onChange={(e) => setText(e.target.value)}
                />
              )}
              {el.value === "Select" && (
                <input
                  type="text"
                  placeholder={`${el.value} : sperate options with '/'`}
                  onChange={(e) => setSelect(e.target.value.split("/"))}
                />
              )}
              {el.value === "CheckBox" && (
                <input
                  type="text"
                  placeholder={`${el.value} : sperate options with '/'`}
                  onChange={(e) => setCheckBox(e.target.value.split("/"))}
                />
              )}
              {el.value === "Image" && (
                <input
                  type="text"
                  placeholder={el.value}
                  onChange={(e) => setImage(e.target.value)}
                />
              )}
              {el.value === "Tag" && (
                <input
                  type="text"
                  placeholder={el.value}
                  onChange={(e) => setTag(e.target.value)}
                />
              )}
            </div>)
            ))}

          <div className="input-field">
            <i className="fas fa-user"></i>
            <input
              type="text"
              placeholder="Description"
              defaultValue={spacePage && spacePage.description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <input
            onClick={updatespacePage}
            readOnly
            value="Update Space Setting"
            className="btn solid"
            style={{ textAlign: "center" }}
          />
        </form>
      </Modal>

      <div>
        <input
          readOnly
          onClick={onOpenModal}
          value="Update"
          className="btn solid"
          style={{ textAlign: "center" }}
        />
      </div>
    </>
  );
}
