import React, { useState, useEffect } from "react";
import { useLocation } from "react-router";
import axios from "axios";
import { useNavigate } from "react-router";
import "react-responsive-modal/styles.css";
import { Modal } from "react-responsive-modal";
import "../../styles/project.css";
import Select from "react-select";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function UpdateGlobalPage() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [globalPage, setGlobalPage] = useState();
  const [name, setName] = useState();
  const [key, setKey] = useState();
  const [description, setDescription] = useState();
  const [globalPageParamter, setGlobalPageParamter] = useState();
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
  const getglobalPage = async () => {
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
        }:5000/api/pfe/user/projects/globalPages/${
          location.pathname.split("/")[2]
        }/${location.pathname.split("/")[4]}`,
        config
      );
      console.log(data.data.globalPage);
      setGlobalPage(data.data.globalPage);
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

  function refreshPage() {
    window.location.reload(false);
  }

  const updateglobalPage = async () => {
    var arr = [];

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
      withCredentials: true,
    };
    try {
      globalPageParamter && globalPageParamter.map((el) => arr.push(el.value));
      var input = { name, key, description };
      arr.length ? (input.paramter = arr):input.paramter=globalPage.paramter;
      text && (input.text = text);
      image && (input.image = image);
      checkBox && (input.checkBox = checkBox);
      tag && (input.tag = tag);

      select && (input.select = select);
      !input.paramter.find(el=>el=="CheckBox")&&(input.checkBox = [])
      !input.paramter.find(el=>el=="Select")&&(input.select = [])
      !input.paramter.find(el=>el=="Text")&&(input.text ="")
      !input.paramter.find(el=>el=="Tag")&&(input.tag ="")
      !input.paramter.find(el=>el=="Image")&&(input.image ="")
      console.log(input);
      const { data } = await axios.patch(
        `http://${
          process.env.REACT_APP_IP_ADDRESS
        }:5000/api/pfe/user/projects/globalPages/${
          location.pathname.split("/")[2]
        }/${location.pathname.split("/")[4]}`,
        input,
        config
      );
      console.log(data);
      refreshPage();
    } catch (error) {
      console.log(error.response.data.error);
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

  useEffect(() => {
    if (!localStorage.getItem("authToken")) {
      navigate("/auth");
    }

    getglobalPage();
  }, []);
  return (
    <>
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
          <h2 className="title">Update Global Page </h2>
          <div className="input-field">
            <i className="fas fa-user"></i>
            <input
              type="text"
              placeholder="name"
              defaultValue={globalPage && globalPage.name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="input-field">
            <i className="fas fa-user"></i>
            <input
              type="text"
              placeholder="key"
              defaultValue={globalPage && globalPage.key}
              onChange={(e) => setKey(e.target.value)}
            />
          </div>

          <div className="input-field">
            <i className="fas fa-user"></i>
            <Select
              isMulti
              defaultValue={globalPageParamter}
              onChange={setGlobalPageParamter}
              options={spaceOptions}
            />
          </div>
          {globalPageParamter &&
            globalPageParamter.map((el) => (
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
              defaultValue={globalPage && globalPage.description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <input
            onClick={updateglobalPage}
            readOnly
            value="Update global Page"
            className="btns solid"
            style={{ textAlign: "center" }}
          />
        </form>
      </Modal>

      <div>
        <input
          readOnly
          onClick={onOpenModal}
          value="Update"
          className="btns solid"
          style={{ textAlign: "center" }}
        />
      </div>
    </>
  );
}
