import React, { useState, useEffect } from "react";
import { useLocation } from "react-router";
import axios from "axios";
import { useNavigate } from "react-router";
import "react-responsive-modal/styles.css";
import { Modal } from "react-responsive-modal";
import "../styles/project.css";

export default function Projects() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [project, setProject] = useState();
  const [name, setName] = useState();
  const [key, setKey] = useState();
  const [macros, setMacros] = useState();
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
        `http://localhost:5000/api/pfe/user/projects/${
          location.pathname.split("/")[2]
        }`,
        config
      );
      // console.log(data.data.project);
      setProject(data.data.project);
    } catch (error) {
      console.log(error.response.data.error.message);
    }
  };
  const getMacros = async () => {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
      withCredentials: true,
    };
    try {
      const { data } = await axios.get(
        `http://localhost:5000/api/pfe/user/projects/macros/allMacros/${
          location.pathname.split("/")[2]
        }`,
        config
      );
      // console.log(data.data.project);
      // console.log(data.data.macros.macros)
      setMacros(data.data.macros.macros);
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
        `http://localhost:5000/api/pfe/user/projects/${project._id}`,
        formData,
        config
      );

      refreshPage();
      // console.log(data)
    } catch (error) {
      console.log(error.response);
    }
  };
  const deleteProject = async (project) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
      withCredentials: true,
    };
    try {
      const { data } = await axios.delete(
        `http://localhost:5000/api/pfe/user/projects/${project._id}`,
        config
      );
      navigate("/projects");
    } catch (error) {
      console.log(error.response);
    }
  };

  useEffect(() => {
    if (!localStorage.getItem("authToken")) {
      navigate("/auth");
    }

    getProject();
    getMacros();
  }, []);
  return (
    <>
    {console.log(macros)}
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
      <div className="Project-container">
        <div className="container-box">
          {project && (
            <>
              <div
                className="project  "
                style={{
                  borderTop: `3px solid #${Math.floor(
                    Math.random() * 16777215
                  ).toString(16)}`,
                }}
              >
                <div className="box-header-container">
                  <div className="box-header">
                    {project.icon && (
                      <img
                        style={{ width: "5em", height: "5em" }}
                        src={require(`../img/icons/${project.icon}`)}
                        alt=""
                      />
                    )}

                    <h2>{project.name}</h2>
                  </div>
                  <a
                    onClick={() => project && deleteProject(project)}
                    className="close"
                  ></a>
                </div>
                <div className="content">
                  <div className="row">
                    <h2>NAME :</h2>
                    <h4>{project.name}</h4>
                  </div>
                  <div className="row">
                    <h2>KEY :</h2>
                    <h4>{project.key}</h4>
                  </div>
                  <div className="row">
                    <h2>DESCRIPTION :</h2>
                    <h4>{project.description}</h4>
                  </div>
                  <div className="row">
                    <h2>VENDOR NAME :</h2>
                    <h4>{project.vendor.name}</h4>
                  </div>
                  <div className="row">
                    <h2>VENDOR URL :</h2>
                    <h4>{project.vendor.url}</h4>
                  </div>
                  <div className="row">
                    <h2>AUTHENTICATION :</h2>
                    <h4>{project.authentication}</h4>
                  </div>
                  <div className="row">
                    <h2>ENABLE LICENSING :</h2>
                    <h4>{project.enableLicensing.toString()}</h4>
                  </div>
                  <div className="row" style={{justifyContent:"flex-start",paddingLeft:"2em"}} >
                    <h2>Macros :</h2></div>
                    <br/>
                    <div
                    style={{
                     
                      height: "100%",
                      display: "flex",
                      gap: "2em",
                      alignItems: "center",
                      flexDirection: "column",
                    }}
                  >
                    {macros&&macros.length?(macros.map((el) => (
                   
                        <div
                        onClick={()=>navigate(`/project/${
                          location.pathname.split("/")[2]
                        }/macro/${el._id}`)}
                          className="box box-down "
                          style={{
                            width:"100%",
                            border: `2px solid #${Math.floor(
                              Math.random() * 16777215
                            ).toString(16)}`,
                          }}
                          key={el._id}
                        >
                          <div style={{display:'flex',gap:"20%",alignItems:"center"}}>
                          <img
                            style={{ width: "5em", height: "5em" , }}
                            src={require(`../img/macros/${el.icon}`)}
                            alt=""
                          />
                          <h2>{el.name}</h2>
                          {/* <GrClose className="close"/> */}
                          
                          </div>
                          <div style={{display:"flex",justifyContent:"center",alignItems:"center",width:"100%"}}><p>{el.description}</p></div>
                          
                          
                          
            
                       
                        </div>
                      
                 
                      ))):(<h3>This Project didn't have any Macro , Please create one </h3>)
                      }
                       </div>
                  
                </div>
              </div>
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
          )}
          
        </div>
      </div>
    </>
  );
}
