import React, { useState, useEffect } from "react";
import { useLocation } from "react-router";
import axios from "axios";
import { useNavigate } from "react-router";
import "react-responsive-modal/styles.css";
import { Modal } from "react-responsive-modal";
import "../styles/project.css";

export default function Macro() {
  const [open, setOpen] = useState(false); 
   const [openAddParamter, setOpenAddParamter] = useState(false);
   const [openUpdateParamter, setOpenUpdateParamter] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [macro, setMacro] = useState();
  const [name, setName] = useState();
  const [key, setKey] = useState();
  const [description, setDescription] = useState();
  const [identifier, setIdentifier] = useState();
  const [paramterDescription, setParamterDescription] = useState();
  const [type, setType] = useState();
  const [required, setRequired] = useState();
  const [multiple, setMultiple] = useState();
  const [paramter, setParamter] = useState();
  const [paramterName, setParamterName] = useState();
  const [bodyType, setBodyType] = useState();
  const [outputType, setOutputType] = useState();
  const [photo, setPhoto] = useState();
  const onOpenModal = () => {
    return setOpen(true);
  };
  const onOpenAddParamterModal = () => {
    return setOpenAddParamter(true);
  };
  const onOpenUpdateParamterModal = (el) => {
      setParamter(el);
    return setOpenUpdateParamter(true);
  };
  const onCloseModal = () => {
    setOpen(false);
    setOpenAddParamter(false);
    setOpenUpdateParamter(false)
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
        `http://localhost:5000/api/pfe/user/projects/macros/${
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

  const addParamter = async () => {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
      withCredentials: true,
    };
    try {
      const { data } = await axios.post(
        `http://localhost:5000/api/pfe/user/projects/macros/paramter/${
          location.pathname.split("/")[4]
        }`,
        {
          paramterName,
          paramterDescription,
          identifier,
          type,
          required,
          multiple,
        },
        config
      );
      refreshPage();
    } catch (error) {
      console.log(error.response.data.error.message);
    }
  };
  const deleteParamter = async (id) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
      withCredentials: true,
    };
    try {
      const { data } = await axios.delete(
        `http://localhost:5000/api/pfe/user/projects/macros/paramter/${
          location.pathname.split("/")[4]
        }/${id}`,
        config
      );
      refreshPage();
    } catch (error) {
      console.log(error.response.data.error.message);
    }
  };
  const updateParamter = async (id) => {
    
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
      withCredentials: true,
    };
    try {
      const { data } = await axios.patch(
        `http://localhost:5000/api/pfe/user/projects/macros/paramter/${
          location.pathname.split("/")[4]
        }/${id}`,{
            paramterName,
            paramterDescription,
            identifier,
            type,
            required,
            multiple,
          },
        config
      );
      console.log(id)
      refreshPage();
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

  const updateMacro = async () => {
    const formData = new FormData();
    formData.append("name", name || macro.name);
    formData.append("key", key || macro.key);
    formData.append("description", description || macro.description);
    formData.append("bodyType", bodyType || macro.bodyType);
    formData.append("outputType", outputType || macro.outputType);
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
        `http://localhost:5000/api/pfe/user/projects/macros/${
          location.pathname.split("/")[2]
        }/${location.pathname.split("/")[4]}`,
        formData,
        config
      );

      refreshPage();
      // console.log(data)
    } catch (error) {
      console.log(error.response);
    }
  };
  const deleteMacro = async () => {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
      withCredentials: true,
    };
    try {
      const { data } = await axios.delete(
        `http://localhost:5000/api/pfe/user/projects/macros/${
          location.pathname.split("/")[2]
        }/${location.pathname.split("/")[4]}`,
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

    getMacro();
  }, []);
  return (
    <>
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
            <input
              type="text"
              placeholder="Body Type :"
              defaultValue={macro && macro.bodyType}
              onChange={(e) => setBodyType(e.target.value)}
            />
          </div>
          <div className="input-field">
            <i className="fas fa-user"></i>
            <input
              type="text"
              placeholder="Output Type:"
              defaultValue={macro && macro.outputType}
              onChange={(e) => setOutputType(e.target.value)}
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
      <Modal open={openAddParamter} onClose={onCloseModal} center>
        <form className="sign-in-form">
          <h2 className="title">Add Paramter</h2>
          <div className="input-field">
            <i className="fas fa-user"></i>
            <input
              type="text"
              placeholder="name"
              onChange={(e) => setParamterName(e.target.value)}
            />
          </div>
          <div className="input-field">
            <i className="fas fa-user"></i>
            <input
              type="text"
              placeholder="identifier"
              onChange={(e) => setIdentifier(e.target.value)}
            />
          </div>
          <div className="input-field">
            <i className="fas fa-user"></i>
            <input
              type="text"
              placeholder="Description"
              onChange={(e) => setParamterDescription(e.target.value)}
            />
          </div>
          <div className="input-field">
            <i className="fas fa-user"></i>
            <input
              type="text"
              placeholder="Type :"
              onChange={(e) => setType(e.target.value)}
            />
          </div>
          <div className="input-field">
            <i className="fas fa-user"></i>
            <input
              type="text"
              placeholder="Required:"
              onChange={(e) => setRequired(e.target.value)}
            />
          </div>
          <div className="input-field">
            <i className="fas fa-user"></i>
            <input
              type="text"
              placeholder="Multiple:"
              onChange={(e) => setMultiple(e.target.value)}
            />
          </div>

          <input
            onClick={addParamter}
            readOnly
            value="Update Macro"
            className="btn solid"
            style={{ textAlign: "center" }}
          />
        </form>
      </Modal>
      <Modal open={openUpdateParamter} onClose={onCloseModal} center>
        <form className="sign-in-form">
          <h2 className="title">Update Paramter</h2>
          <div className="input-field">
            <i className="fas fa-user"></i>
            <input
              type="text"
              placeholder="name"
              defaultValue={paramter&&paramter.paramterName}
              onChange={(e) => setParamterName(e.target.value)}
            />
          </div>
          <div className="input-field">
            <i className="fas fa-user"></i>
            <input
              type="text"
              placeholder="identifier"
              defaultValue={paramter&&paramter.identifier}
              onChange={(e) => setIdentifier(e.target.value)}
            />
          </div>
          <div className="input-field">
            <i className="fas fa-user"></i>
            <input
              type="text"
              placeholder="Description"
              defaultValue={paramter&&paramter.paramterDescription}
              onChange={(e) => setParamterDescription(e.target.value)}
            />
          </div>
          <div className="input-field">
            <i className="fas fa-user"></i>
            <input
              type="text"
              placeholder="Type :"
              defaultValue={paramter&&paramter.type}
              onChange={(e) => setType(e.target.value)}
            />
          </div>
          <div className="input-field">
            <i className="fas fa-user"></i>
            <input
              type="text"
              placeholder="Required:"
              defaultValue={paramter&&paramter.required}
              onChange={(e) => setRequired(e.target.value)}
            />
          </div>
          <div className="input-field">
            <i className="fas fa-user"></i>
            <input
              type="text"
              placeholder="Multiple:"
              defaultValue={paramter&&paramter.multiple}
              onChange={(e) => setMultiple(e.target.value)}
            />
          </div>

          <input
            onClick={()=>paramter&&updateParamter(paramter._id)}
            readOnly
            value="Update Paramter"
            className="btn solid"
            style={{ textAlign: "center" }}
          />
        </form>
      </Modal>
      <div className="Project-container">
        <div className="container-box">
          {macro && (
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
                    {macro.icon && (
                      <img
                        style={{ width: "5em", height: "5em" }}
                        src={require(`../img/macros/${macro.icon}`)}
                        alt=""
                      />
                    )}

                    <h2>{macro.name}</h2>
                  </div>
                  <a onClick={deleteMacro} className="close"></a>
                </div>
                <div className="content">
                  <div className="row">
                    <h2>NAME :</h2>
                    <h4>{macro.name}</h4>
                  </div>
                  <div className="row">
                    <h2>KEY :</h2>
                    <h4>{macro.key}</h4>
                  </div>
                  <div className="row">
                    <h2>DESCRIPTION :</h2>
                    <h4>{macro.description}</h4>
                  </div>
                  <div className="row">
                    <h2>BODY TYPE :</h2>
                    <h4>{macro.bodyType}</h4>
                  </div>
                  <div className="row">
                    <h2>OUTPUT TYPE :</h2>
                    <h4>{macro.outputType}</h4>
                  </div>

                  <div className="row">
                    <h2>Paramters :</h2>
                    <input
                      readOnly
                      onClick={onOpenAddParamterModal}
                      value="Add Paramter"
                      className="btn solid"
                      style={{ textAlign: "center" }}
                    />
                  </div>
                  <br />
                  <div
                    style={{
                      // height: "100%",
                      display: "flex",
                      gap: "2em",
                      alignItems: "center",
                      flexDirection: "column",
                    }}
                  >
                    {macro && macro.parameters.length ? (
                      macro.parameters.map((el) => (
                        <>
                          <div
                            className="box box-down "
                            style={{
                              paddingTop: "1em",
                              paddingLeft: "0",
                              paddingBottom:"0",
                              width: "100%",
                              border: `2px solid #${Math.floor(
                                Math.random() * 16777215
                              ).toString(16)}`,
                            }}
                            key={el._id}
                          >
                            <div
                              className="row"
                              style={{
                                width: "100%",
                                justifyContent: "flex-end",
                                height: "2em",
                              }}
                            >
                              <a
                                onClick={() => deleteParamter(el._id)}
                                className="close"
                              ></a>
                            </div>
                            <div className="row">
                              <h2>Name :</h2>
                              <h4>{el.paramterName}</h4>
                            </div>
                            <div className="row">
                              <h2>identifier :</h2>
                              <h4>{el.identifier}</h4>
                            </div>
                            <div className="row">
                              <h2>Description :</h2>
                              <h4>{el.paramterDescription}</h4>
                            </div>
                            <div className="row">
                              <h2>Type :</h2>
                              <h4>{el.type}</h4>
                            </div>
                            <div className="row">
                              <h2>Required :</h2>
                              <h4>{el.required.toString()}</h4>
                            </div>
                            <div className="row">
                              <h2>multiple :</h2>
                              <h4>{el.multiple.toString()}</h4>
                            </div>
                            <div style={{display:"flex",justifyContent:"center",alignItems:"center",width:"100%"}}>
                            <input
                              readOnly
                              onClick={()=>onOpenUpdateParamterModal(el)}
                              value="Update Paramter"
                              className="btn solid"
                              style={{ textAlign: "center" }}
                            />
                          </div>
                          </div>
                         
                        </>
                      ))
                    ) : (
                      <></>
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
            </>
          )}
        </div>
      </div>
    </>
  );
}
