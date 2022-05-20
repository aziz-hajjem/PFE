import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import "react-responsive-modal/styles.css";
import { Modal } from "react-responsive-modal";
import { useNavigate } from "react-router";
import "../../styles/projects.css";
import { css } from "@emotion/react";
import ClockLoader from "react-spinners/ClockLoader";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Project() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [projects, setProjects] = useState();
  const [name, setName] = useState();
  const [key, setKey] = useState();
  const [description, setDescription] = useState();
  const override = css`
    display: block;
    margin: auto auto;
    border-color: #231e39;
  `;
  const onOpenModal = () => {
    return setOpen(true);
  };
  const onCloseModal = () => {
    setOpen(false);
  };
  function refreshPage() {
    window.location.reload(false);
  }
  const addProject = async () => {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
      withCredentials: true,
    };
    try {
      const { data } = await axios.post(
        `http://${process.env.REACT_APP_IP_ADDRESS}:5000/api/pfe/user/projects/createProject`,
        { name, key, description },
        config
      );

      refreshPage();
      // console.log(data)
    } catch (error) {
      console.log(error.response.data.error.message);
      toast.error(error.response.data.error.message, {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        });
    }
  };
  const getProjects = async () => {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
      withCredentials: true,
    };
    try {
      const { data } = await axios.get(
        `http://${process.env.REACT_APP_IP_ADDRESS}:5000/api/pfe/user/projects/allProjects`,
        config
      );
      // console.log(data);
      setProjects(data.data.projects);
    } catch (error) {
      console.log(error.response.data.error.message);
    }
  };
  function refreshPage() {
    window.location.reload(false);
  }
  
  useEffect(() => {
    if (!localStorage.getItem("authToken")) {
      navigate("/auth");
    }

    getProjects();
  }, []);
  return (
<>
{projects?(
      <div className="Projects-container">
      <Modal open={open} onClose={onCloseModal} center>
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover={false}
      />
        <form className="sign-in-form">
          <h2 className="title">Add Project</h2>
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
            <input
              type="text"
              placeholder="Description"
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <a
            onClick={addProject}
            className="cyan-btn"
            style={{
              textAlign: "center",
              padding: "0.8rem 2.3rem",
              fontSize: "1.1rem",
              fontWeight: "500",
            }}
          >
            Add project{" "}
          </a>
        </form>
      </Modal>

      <div
        style={{
          padding: "2em",
          height: "100%",
          display: "flex",
          gap: "2em",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <div className=" box-title">
          <div>
            <h2>List of Projects</h2>
            <p>You have {projects && projects.length} projects</p>
          </div>
          
          <div id="container" onClick={onOpenModal}>
            <button className="learn-more">
              <span className="circle" aria-hidden="true">
                <span className="icon arrow"></span>
              </span>
              <span className="button-text">Add Project</span>
            </button>
          </div>
        </div>
        {projects &&
          projects.map((el) => (
            <div
              onClick={() => navigate(`/project/${el._id}`)}
              className="box box-down "
              style={{
                borderTop: `3px solid #${Math.floor(
                  Math.random() * 16777215
                ).toString(16)}`,
              }}
              key={el._id}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <h2>{el.name}</h2>
                {/* <GrClose className="close"/> */}
              </div>
              <p>{el.description}</p>
              <img
                style={{ width: "5em", height: "5em" }}
                src={require(`../../img/icons/${el.icon}`)}
                alt=""
              />
            </div>
          ))}
      </div>
    </div>
):( <ClockLoader color="#231E39" loading={true} css={override} size={150} />)}
</>
  );
}
