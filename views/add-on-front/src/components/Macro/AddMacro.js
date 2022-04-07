import React, { useState, useEffect } from "react";
import { useLocation } from "react-router";
import axios from "axios";
import "react-responsive-modal/styles.css";
import { Modal } from "react-responsive-modal";

import Select from "react-select";

export default function Projects() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const [name, setName] = useState();
  const [key, setKey] = useState();
  const [description, setDescription] = useState();
  const [parameter, setParamter] = useState();
  const options = [
    { value: "String", label: "String" },
    { value: "Select", label: "Select" },
    { value: "both", label: "Both" },
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
    setParamter(parameter.value);
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
      withCredentials: true,
    };
    try {
      const { data } = await axios.post(
        `http://${
          process.env.REACT_APP_IP_ADDRESS
        }:5000/api/pfe/user/projects/macros/createMacro/${
          location.pathname.split("/")[2]
        }`,
        { name, key, description, parameter },
        config
      );
      console.log(data);
      refreshPage();
    } catch (error) {
      console.log(error.response.data.error.message);
    }
  };
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
          <h2 className="title">Add Macro</h2>
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
              defaultValue={parameter}
              onChange={setParamter}
              options={options}
            />
          </div>
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
