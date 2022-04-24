import React, { useState, useEffect } from "react";
import { useLocation } from "react-router";
import axios from "axios";
import { useNavigate } from "react-router";
import "react-responsive-modal/styles.css";
import { Modal } from "react-responsive-modal";
import "../../styles/project.css";
import Select from "react-select";

export default function AddMacro() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [name, setName] = useState();
  const [key, setKey] = useState();
  const [description, setDescription] = useState();
  const [macroParamter, setmacroParamter] = useState();
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

  function refreshPage() {
    window.location.reload(false);
  }

  const addMacro = async () => {
    var arr = [];

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
      withCredentials: true,
    };
    try {
      macroParamter && macroParamter.map((el) => arr.push(el.value));
      var input = { name, key, description };
      arr && (input.paramter = arr);
      text && (input.text = text);
      image && (input.image = image);
      checkBox && (input.checkBox = checkBox);
      tag && (input.tag = tag);
      select && (input.select = select);
      console.log(input);
      const { data } = await axios.post(
        `http://${
          process.env.REACT_APP_IP_ADDRESS
        }:5000/api/pfe/user/projects/macros/createMacro/${
          location.pathname.split("/")[2]
        }`,
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
  }, []);
  return (
    <>
      <div>
        <input
          readOnly
          onClick={onOpenModal}
          value="Add Macro"
          className="btn solid"
          style={{ textAlign: "center" }}
        />
      </div>
      <Modal open={open} onClose={onCloseModal} center>
        <form className="sign-in-form">
          <h2 className="title">Add Macro </h2>
          <div className="input-field">
            <i className="fas fa-user"></i>
            <input
              type="text"
              placeholder="name"
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="input-field">
            <i className="fas fa-user"></i>
            <input
              type="text"
              placeholder="key"
              onChange={(e) => setKey(e.target.value)}
            />
          </div>

          <div className="input-field">
            <i className="fas fa-user"></i>
            <Select
              isMulti
              defaultValue={macroParamter}
              onChange={setmacroParamter}
              options={spaceOptions}
            />
          </div>
          {macroParamter &&
            macroParamter.map((el) => (
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
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <input
            onClick={addMacro}
            readOnly
            value="Add Macro"
            className="btn solid"
            style={{ textAlign: "center" }}
          />
        </form>
      </Modal>
    </>
  );
}
