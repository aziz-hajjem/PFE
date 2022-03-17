import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import "react-responsive-modal/styles.css";
import { Modal } from "react-responsive-modal";
import { useNavigate } from "react-router";
import "../styles/projects.css";

export default function Project() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [projects, setProjects] = useState();
  const [name, setName] = useState();
  const [key, setKey] = useState();
  const [description, setDescription] = useState();
  const [authentication, setAuthentication] = useState();
  const [enableLicensing, setEnableLicensing] = useState();
  const [vendorName, setVendorName] = useState();
  const [vendorUrl, setVendorUrl] = useState();
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
        `http://192.168.100.136:5000/api/pfe/user/projects/createProject`,
        {name,key,authentication,description,enableLicensing,vendorName,vendorUrl},
        config
      );

      refreshPage();
      // console.log(data)
    } catch (error) {
      console.log(error.response.data.error.message);
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
        "http://192.168.100.136:5000/api/pfe/user/projects/allProjects",
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
  const deleteProject = async (id) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
      withCredentials: true,
    };
    try {
      const { data } = await axios.delete(
        `http://192.168.100.136:5000/api/pfe/user/projects/${id}`,
        config
      );
      navigate('/projects')
      
    } catch (error) {
      console.log(error.response);
    }
  };
  useEffect(() => {
    if (!localStorage.getItem("authToken")) {
      navigate("/auth");
    }

    getProjects();
  }, []);
  return (
    <div className="Projects-container">
      <Modal open={open} onClose={onCloseModal} center>
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
          <div className="input-field">
            <i className="fas fa-user"></i>
            <input
              type="text"
              placeholder="Authentication"
              onChange={(e) => setAuthentication(e.target.value)}
            />
          </div>
          <div className="input-field">
            <i className="fas fa-user"></i>
            <input
              type="text"
              placeholder="Enable Licensing"
              onChange={(e) => setEnableLicensing(e.target.value)}
            />
          </div>
          <div className="input-field">
            <i className="fas fa-user"></i>
            <input
              type="text"
              placeholder="Vendor Name"
              onChange={(e) => setVendorName(e.target.value)}
            />
          </div>
          <div className="input-field">
            <i className="fas fa-user"></i>
            <input
              type="text"
              placeholder="Vendor Url"
              onChange={(e) => setVendorUrl(e.target.value)}
            />
          </div>

          <input
            onClick={addProject}
            readOnly
            value="Add"
            className="btn solid"
            style={{ textAlign: "center" }}
          />
        </form>
      </Modal>
      {/* {projects&&projects.length||<h1>This user didn't have any project ,Please Create one 😄</h1>}     */}

      {/* {projects&&projects.length?projects.map(el=>(
            <div>{el.name}{el._id}</div>
        )):(<h1>This user didn't have projects</h1>)} */}
       
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
        <input
       onClick={onOpenModal}
            readOnly
            value="Add Project"
            className="btn solid"
            style={{ textAlign: "center" }}
          />
        {projects &&
          projects.map((el) => (
            <div
            onClick={()=>navigate(`/project/${el._id}`)}
              className="box box-down "
              style={{
                borderTop: `3px solid #${Math.floor(
                  Math.random() * 16777215
                ).toString(16)}`,
              }}
              key={el._id}
            >
              <div style={{display:'flex',justifyContent:"space-between",alignItems:"center"}}>
              <h2>{el.name}</h2>
              {/* <GrClose className="close"/> */}
              
              </div>
              <p>{el.description}</p>
              <img
                style={{ width: "5em", height: "5em" }}
                src={require(`../img/icons/${el.icon}`)}
                alt=""
              />
              

           
            </div>
          ))}
      </div>
    </div>
  );
}
