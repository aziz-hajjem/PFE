import React, { useState, useEffect } from "react";
import { useLocation } from "react-router";
import axios from "axios";
import { useNavigate } from "react-router";
import "react-responsive-modal/styles.css";
import { Modal } from "react-responsive-modal";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../styles/project.css";
import Select from "react-select";
const FileDownload = require("js-file-download");

export default function Projects() {
  const [open, setOpen] = useState(false);
  const [openAddMacro, setOpenAddMacro] = useState(false);
  const [openAddSpace, setOpenAddSpace] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const [project, setProject] = useState();
  const [name, setName] = useState();
  const [key, setKey] = useState();
  const [macros, setMacros] = useState();
  const [spaceSettings, setSpaceSettings] = useState();
  const [description, setDescription] = useState();
  const [authentication, setAuthentication] = useState();
  const [enableLicensing, setEnableLicensing] = useState();
  const [spaceParameter, setSpaceParameter] = useState();
  const [text, setText] = useState();
  const [select, setSelect] = useState(null);
  const [tag, setTag] = useState();
  const [image, setImage] = useState();
  const [checkBox, setCheckBox] = useState(null);
  const [parameter, setParamter] = useState();
  const [photo, setPhoto] = useState();
  const spaceOptions = [
    { value: "Text", label: "Text" },
    { value: "Tag", label: "Tag" },
    { value: "CheckBox", label: "CheckBox" },
    { value: "Select", label: "Select" },
    { value: "Image", label: "Image" },
  ];
  const options = [
    { value: "String", label: "String" },
    { value: "Select", label: "Select" },
    { value: "both", label: "Both" },
  ];
  const onOpenModal = () => {
    return setOpen(true);
  };
  const onOpenAddModal = () => {
    return setOpenAddMacro(true);
  };
  const onOpenAddSpace = () => {
    return setOpenAddSpace(true);
  };
  const onCloseModal = () => {
    setOpen(false);
    setOpenAddMacro(false);
    setOpenAddSpace(false);
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
      // console.log(data.data.project);
      setProject(data.data.project);
    } catch (error) {
      console.log(error.response.data.error.message);
    }
  };
  const generate = async () => {
    const config = {
      responseType: "arraybuffer",
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
        }:5000/api/pfe/user/projects/${
          location.pathname.split("/")[2]
        }/generate`,
        config
      );
      project && FileDownload(data, `${project.name}.zip`);
      // console.log(data.data.project);
      // setProject(data.data.project);
      toast.success(" Succes , Please check your downloads !", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } catch (error) {
      console.log(error.response.data);
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
        `http://${
          process.env.REACT_APP_IP_ADDRESS
        }:5000/api/pfe/user/projects/macros/allMacros/${
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
  const getSpaceSettings = async () => {
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
        }:5000/api/pfe/user/projects/spaceSettings/allSpaceSettings/${
          location.pathname.split("/")[2]
        }`,
        config
      );
      console.log(data.data.spaceSettings);
      setSpaceSettings(data.data.spaceSettings);
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
  const addSpace = async () => {
    var arr=[];
   
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
      withCredentials: true,
    };
    try {
      spaceParameter&&(spaceParameter.map(el=>arr.push(el.value)))
      var input={name,key,description}
      arr&&(input.paramter =arr)
      text&&(input.text=text);
      image&&(input.image=image);
      checkBox&&(input.checkBox=checkBox);
      tag&&(input.tag=tag);
      
      select&&(input.select=select);
      console.log(input)
      const { data } = await axios.post(
        `http://${process.env.REACT_APP_IP_ADDRESS}:5000/api/pfe/user/projects/spaceSettings/createSpaceSetting/${
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
        `http://${process.env.REACT_APP_IP_ADDRESS}:5000/api/pfe/user/projects/${project._id}`,
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
    getSpaceSettings();
  }, []);
  return (
    <>
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
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
      <Modal open={openAddMacro} onClose={onCloseModal} center>
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
          {/* {parameter&&(<div className="input-field">
            <i className="fas fa-user"></i>
            <input
              type="text"
              placeholder="azzaaz"
              
            />
          </div>)} */}

          <input
            onClick={addMacro}
            readOnly
            value="Add Macro"
            className="btn solid"
            style={{ textAlign: "center" }}
          />
        </form>
      </Modal>
      <Modal open={openAddSpace} onClose={onCloseModal} center>
        <form className="sign-in-form">
          <h2 className="title">Add Space Setting </h2>
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
              defaultValue={spaceParameter}
              onChange={setSpaceParameter}
              options={spaceOptions}
            />
            </div>
            {spaceParameter &&
              spaceParameter.map((el) => (
                <div className="input-field">
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
                      placeholder={el.value}
                      onChange={(e) => setSelect(e.target.value.split("/"))}
                    />
                  )}
                  {el.value === "CheckBox" && (
                    <input
                      type="text"
                      placeholder={el.value}
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
                </div>
              ))}
          

          {/* {parameter&&(<div className="input-field">
            <i className="fas fa-user"></i>
            <input
              type="text"
              placeholder="azzaaz"
              
            />
          </div>)} */}
          <div className="input-field">
            <i className="fas fa-user"></i>
            <input
              type="text"
              placeholder="Description"
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <input
            onClick={addSpace}
            readOnly
            value="Add Space Setting"
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
                  <div
                    className="row"
                    style={{
                      justifyContent: "space-between",
                      paddingLeft: "2em",
                    }}
                  >
                    <h2>Macros :</h2>
                    <div>
                      <input
                        readOnly
                        onClick={onOpenAddModal}
                        value="Add Macro"
                        className="btn solid"
                        style={{ textAlign: "center" }}
                      />
                    </div>
                  </div>

                  <br />
                  <div
                    style={{
                      display: "flex",
                      gap: "2em",
                      alignItems: "center",
                      flexDirection: "column",
                    }}
                  >
                    {macros && macros.length ? (
                      macros.map((el) => (
                        <div
                          onClick={() =>
                            navigate(
                              `/project/${
                                location.pathname.split("/")[2]
                              }/macro/${el._id}`
                            )
                          }
                          className="box box-down "
                          style={{
                            width: "100%",
                            border: `2px solid #${Math.floor(
                              Math.random() * 16777215
                            ).toString(16)}`,
                          }}
                          key={el._id}
                        >
                          <div
                            style={{
                              display: "flex",
                              gap: "20%",
                              alignItems: "center",
                            }}
                          >
                            <img
                              style={{ width: "5em", height: "5em" }}
                              src={require(`../img/macros/${el.icon}`)}
                              alt=""
                            />
                            <h2>{el.name}</h2>
                            {/* <GrClose className="close"/> */}
                          </div>
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              width: "100%",
                            }}
                          >
                            <p>{el.description}</p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <h3>
                        This Project didn't have any Macro , Please create one{" "}
                      </h3>
                    )}
                  </div>
                  <div
                    className="row"
                    style={{
                      justifyContent: "space-between",
                      paddingLeft: "2em",
                    }}
                  >
                    <h2>Space Settings :</h2>
                    <div>
                      <input
                        readOnly
                        onClick={onOpenAddSpace}
                        value="Space Setting "
                        className="btn solid"
                        style={{ textAlign: "center" }}
                      />
                    </div>
                  </div>
                  <br />
                  <div
                    style={{
                      display: "flex",
                      gap: "2em",
                      alignItems: "center",
                      flexDirection: "column",
                    }}
                  >
                    {spaceSettings && spaceSettings.length ? (
                      spaceSettings.map((el) => (
                        <div
                          onClick={() =>
                            navigate(
                              `/project/${
                                location.pathname.split("/")[2]
                              }/spaceSetting/${el._id}`
                            )
                          }
                          className="box box-down "
                          style={{
                            width: "100%",
                            border: `2px solid #${Math.floor(
                              Math.random() * 16777215
                            ).toString(16)}`,
                          }}
                          key={el._id}
                        >
                          <div
                            style={{
                              display: "flex",
                              gap: "20%",
                              alignItems: "center",
                            }}
                          >
                            <h2>{el.name}</h2>
                            {/* <GrClose className="close"/> */}
                          </div>
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              width: "100%",
                            }}
                          >
                            <p>{el.description}</p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <h3>
                        This Project didn't have any Space Settings , Please
                        create one
                      </h3>
                    )}
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
              <div>
                <input
                  readOnly
                  onClick={generate}
                  value="Generate"
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
