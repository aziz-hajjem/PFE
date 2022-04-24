import React, { useState, useEffect } from "react";
import { useLocation } from "react-router";
import axios from "axios";
import { useNavigate } from "react-router";
import "react-responsive-modal/styles.css";
import { Modal } from "react-responsive-modal";
import "react-toastify/dist/ReactToastify.css";
import "../../styles/project.css";


export default function UpdateProject() {
  const [open, setOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const [project, setProject] = useState();
  const [name, setName] = useState();
  const [key, setKey] = useState();

  const [description, setDescription] = useState();
  const [authentication, setAuthentication] = useState();
  const [enableLicensing, setEnableLicensing] = useState();

  const [photo, setPhoto] = useState();

  const onOpenModal = () => {
    return setOpen(true);
  };
  const onCloseModal = () => {
    setOpen(false);
  };
  const getProject = async () => {
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
        }:5000/api/pfe/user/projects/${location.pathname.split("/")[2]}`,
        config
      );
      setProject(data.data.project);
    } catch (error) {
      console.log(error.response.data.error.message);
    }
  };

  const onInputChange = (e) => {
    setPhoto(e.target.files[0]);
  };

  function refreshPage() {
    window.location.reload(false);
  }

  const updateHandler = async (project) => {
    const formData = new FormData();
    formData.append("name", name || project.name);
    formData.append("key", key || project.key);
    formData.append("description", description || project.description);
    formData.append("authentication", authentication || project.authentication);
    formData.append(
      "enableLicensing",
      enableLicensing || project.enableLicensing
    );
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
        `http://${process.env.REACT_APP_IP_ADDRESS}:5000/api/pfe/user/projects/${project._id}`,
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

    getProject();
  }, []);
  return (
    <>
      <Modal open={open} onClose={onCloseModal} center>
        <form className="sign-in-form">
          <h2 className="title">Update Project</h2>
          <div className="input-field">
            <i className="fas fa-user"></i>
            <input
              type="text"
              placeholder="name"
              defaultValue={project && project.name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="input-field">
            <i className="fas fa-user"></i>
            <input
              type="text"
              placeholder="key"
              defaultValue={project && project.key}
              onChange={(e) => setKey(e.target.value)}
            />
          </div>
          <div className="input-field">
            <i className="fas fa-user"></i>
            <input
              type="text"
              placeholder="Description"
              defaultValue={project && project.description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="input-field">
            <i className="fas fa-user"></i>
            <input
              type="text"
              placeholder="Authentication"
              defaultValue={project && project.authentication}
              onChange={(e) => setAuthentication(e.target.value)}
            />
          </div>
          <div className="input-field">
            <i className="fas fa-user"></i>
            <input
              type="text"
              placeholder="Enable Licensing"
              defaultValue={project && project.enableLicensing}
              onChange={(e) => setEnableLicensing(e.target.value)}
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
            onClick={() => project && updateHandler(project)}
            readOnly
            value="Update"
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