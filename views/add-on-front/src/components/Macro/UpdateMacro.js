import React, { useState, useEffect } from "react";
import { useLocation } from "react-router";
import axios from "axios";
import "react-responsive-modal/styles.css";
import { Modal } from "react-responsive-modal";
import { useNavigate } from "react-router";


import Select from "react-select";

export default function Projects() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [name, setName] = useState();
  const [key, setKey] = useState();
  const [description, setDescription] = useState();
  const [parameter, setParameter] = useState("");
  const [photo, setPhoto] = useState();
  const [macro, setMacro] = useState();

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
  const onInputChange = (e) => {
    setPhoto(e.target.files[0]);
  };
  const getMacro = async () => {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
      withCredentials: true,
    };
    try {
      const { data } = await axios.get(
        `http://${process.env.REACT_APP_IP_ADDRESS}:5000/api/pfe/user/projects/macros/${
          location.pathname.split("/")[2]
        }/${location.pathname.split("/")[4]}`,
        config
      );
      console.log(data.data.macro);
      setMacro(data.data.macro);
    } catch (error) {
      console.log(error.response.data.error.message);
    }
  };
  const updateMacro = async () => {
    const formData = new FormData();
    formData.append("name", name || macro.name);
    formData.append("key", key || macro.key);
    formData.append("description", description || macro.description);
    formData.append("parameter", parameter.value || macro.parameter);
    formData.append("icon", photo);

    const config = {
      headers: {
        // "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
      // withCredentials: true,
    };
    try {
      const { data } = await axios.patch(
        `http://${process.env.REACT_APP_IP_ADDRESS}:5000/api/pfe/user/projects/macros/${
          location.pathname.split("/")[2]
        }/${location.pathname.split("/")[4]}`,
        formData,
        config
      );

      refreshPage();
      // console.log(data)
    } catch (error) {
      console.log(error.response.data.error.message);
    }
  };
  useEffect(() => {
    if (!localStorage.getItem("authToken")) {
      navigate("/auth");
    }

    getMacro();
  }, []);
  return (
    <>
      <div>
        <input
          readOnly
          onClick={onOpenModal}
          value="Update"
          className="btn solid"
          style={{ textAlign: "center" }}
        />
      </div>

      <Modal open={open} onClose={onCloseModal} center>
        <form className="sign-in-form">
          <h2 className="title">Update Macro</h2>
          <div className="input-field">
            <i className="fas fa-user"></i>
            <input
              type="text"
              placeholder="name"
              defaultValue={macro && macro.name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="input-field">
            <i className="fas fa-user"></i>
            <input
              type="text"
              placeholder="key"
              defaultValue={macro && macro.key}
              onChange={(e) => setKey(e.target.value)}
            />
          </div>
          <div className="input-field">
            <i className="fas fa-user"></i>
            <input
              type="text"
              placeholder="Description"
              defaultValue={macro && macro.description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="input-field">
            <i className="fas fa-user"></i>
            <Select
              defaultValue={parameter}
              onChange={setParameter}
              options={options}
            />
          </div>
          <div
            className="input-field"
            style={{ display: "flex", alignItems: "center", gap: "2em" }}
          >
            <i className="fas fa-lock"></i>
            <input type="file" onChange={onInputChange} />
          </div>

          <input
            onClick={updateMacro}
            readOnly
            value="Update Macro"
            className="btn solid"
            style={{ textAlign: "center" }}
          />
        </form>
      </Modal>
    </>
  );
}
