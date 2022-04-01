import React, { useState, useEffect } from "react";
import { useLocation } from "react-router";
import axios from "axios";
import { useNavigate } from "react-router";
import "react-responsive-modal/styles.css";
import { Modal } from "react-responsive-modal";
import "../styles/project.css";
import Select from 'react-select';


export default function Macro() {
  const [open, setOpen] = useState(false); 
  const navigate = useNavigate();
  const location = useLocation();
  const [spaceSetting, setSpaceSetting] = useState();
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
    { value: "Select", label: "Both" },
    { value: "CheckBox", label: "CheckBox" },
    { value: "Select", label: "Select" },
    { value: "Image", label: "Image" },
  ];
  const onOpenModal = () => {
    return setOpen(true);
  };
  
  const onCloseModal = () => {
    setOpen(false);
  };
  const getSpaceSetting = async () => {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
      withCredentials: true,
    };
    try {
      const { data } = await axios.get(
        `http://${process.env.REACT_APP_IP_ADDRESS}:5000/api/pfe/user/projects/spaceSettings/${
          location.pathname.split("/")[2]
        }/${location.pathname.split("/")[4]}`,
        config
      );
      console.log(data.data.spaceSetting);
      setSpaceSetting(data.data.spaceSetting);
    } catch (error) {
      console.log(error.response.data.error.message);
    }
  };

  


  function refreshPage() {
    window.location.reload(false);
  }
  
  const updateSpaceSetting = async () => {
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
      const { data } = await axios.patch(
        `http://${process.env.REACT_APP_IP_ADDRESS}:5000/api/pfe/user/projects/spaceSettings/${
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
  const deleteSpaceSetting = async () => {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
      withCredentials: true,
    };
    try {
      const { data } = await axios.delete(
        `http://${process.env.REACT_APP_IP_ADDRESS}:5000/api/pfe/user/projects/spaceSettings/${
          location.pathname.split("/")[2]
        }/${location.pathname.split("/")[4]}`,
        config
      );
      navigate(`/project/${
        location.pathname.split("/")[2]
      }`);
    } catch (error) {
      console.log(error.response);
    }
  };

  useEffect(() => {
    if (!localStorage.getItem("authToken")) {
      navigate("/auth");
    }

    getSpaceSetting();
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
              defaultValue={spaceSetting && spaceSetting.name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="input-field">
            <i className="fas fa-user"></i>
            <input
              type="text"
              placeholder="key"
              defaultValue={spaceSetting && spaceSetting.key}
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
          </div>


          <div className="input-field">
            <i className="fas fa-user"></i>
            <input
              type="text"
              placeholder="Description"
              defaultValue={spaceSetting && spaceSetting.description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <input
            onClick={updateSpaceSetting}
            readOnly
            value="Update Space Setting"
            className="btn solid"
            style={{ textAlign: "center" }}
          />
        </form>
      </Modal>
     
      
      <div className="Project-container">
        <div className="container-box">
          {spaceSetting && (
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
                    

                    <h2>{spaceSetting.name}</h2>
                  </div>
                  <a onClick={deleteSpaceSetting} className="close"></a>
                </div>
                <div className="content">
                  <div className="row">
                    <h2>NAME :</h2>
                    <h4>{spaceSetting.name}</h4>
                  </div>
                  <div className="row">
                    <h2>KEY :</h2>
                    <h4>{spaceSetting.key}</h4>
                  </div>
                  <div className="row">
                    <h2>DESCRIPTION :</h2>
                    <h4>{spaceSetting.description}</h4>
                  </div>
                  <div className="row">
                    <h2>Paramter :</h2>
                    <h4>{spaceSetting.paramter.map(el=>`[${el} ]`)}</h4>
                  </div>

                  <br />

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
