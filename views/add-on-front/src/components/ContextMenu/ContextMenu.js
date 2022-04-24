import React, { useState, useEffect } from "react";
import { useLocation } from "react-router";
import axios from "axios";
import { useNavigate } from "react-router";
import "react-responsive-modal/styles.css";
import "../../styles/project.css";
import UpdateContextMenu from "./UpdateContextMenu";


export default function ContextMenu() {
  const navigate = useNavigate();
  const location = useLocation();
  const [contextMenu, setContextMenu] = useState();


  const getcontextMenu = async () => {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
      withCredentials: true,
    };
    try {
      const { data } = await axios.get(
        `http://${process.env.REACT_APP_IP_ADDRESS}:5000/api/pfe/user/projects/contextMenu/${
          location.pathname.split("/")[2]
        }/${location.pathname.split("/")[4]}`,
        config
      );
      console.log(data.data.contextMenu);
      setContextMenu(data.data.contextMenu);
    } catch (error) {
      console.log(error.response.data.error.message);
    }
  };
  
  const deletecontextMenu = async () => {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
      withCredentials: true,
    };
    try {
      const { data } = await axios.delete(
        `http://${process.env.REACT_APP_IP_ADDRESS}:5000/api/pfe/user/projects/contextMenu/${
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
    getcontextMenu();
  }, []);
  return (
    <>
      <div className="Project-container">
        <div className="container-box">
          {contextMenu && (
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
                    <h2>{contextMenu.name}</h2>
                  </div>
                  <a onClick={deletecontextMenu} className="close"></a>
                </div>
                <div className="content">
                  <div className="row">
                    <h2>NAME :</h2>
                    <h4>{contextMenu.name}</h4>
                  </div>
                  <div className="row">
                    <h2>KEY :</h2>
                    <h4>{contextMenu.key}</h4>
                  </div>
                  <div className="row">
                    <h2>DESCRIPTION :</h2>
                    <h4>{contextMenu.description}</h4>
                  </div>
                  <div className="row">
                    <h2>Paramter :</h2>
                    <h4>{contextMenu.paramter.map(el=>`[${el} ]`)}</h4>
                  </div>
                  <br />               
                </div>
              </div>
             <UpdateContextMenu/>
            </>
          )}
        </div>
      </div>
    </>
  );
}
