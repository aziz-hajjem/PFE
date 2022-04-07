import React, { useState, useEffect } from "react";
import { useLocation } from "react-router";
import axios from "axios";
import { useNavigate } from "react-router";
import "react-responsive-modal/styles.css";
import "../../styles/project.css";
import UpdateSpacePage from "./UpdateSpacePage"


export default function SpacePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [spacePage, setspacePage] = useState();


  const getspacePage = async () => {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
      withCredentials: true,
    };
    try {
      const { data } = await axios.get(
        `http://${process.env.REACT_APP_IP_ADDRESS}:5000/api/pfe/user/projects/spacePages/${
          location.pathname.split("/")[2]
        }/${location.pathname.split("/")[4]}`,
        config
      );
      console.log(data.data.spacePage);
      setspacePage(data.data.spacePage);
    } catch (error) {
      console.log(error.response.data.error.message);
    }
  };
  
  const deletespacePage = async () => {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
      withCredentials: true,
    };
    try {
      const { data } = await axios.delete(
        `http://${process.env.REACT_APP_IP_ADDRESS}:5000/api/pfe/user/projects/spacePages/${
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
    getspacePage();
  }, []);
  return (
    <>
      <div className="Project-container">
        <div className="container-box">
          {spacePage && (
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
                    <h2>{spacePage.name}</h2>
                  </div>
                  <a onClick={deletespacePage} className="close"></a>
                </div>
                <div className="content">
                  <div className="row">
                    <h2>NAME :</h2>
                    <h4>{spacePage.name}</h4>
                  </div>
                  <div className="row">
                    <h2>KEY :</h2>
                    <h4>{spacePage.key}</h4>
                  </div>
                  <div className="row">
                    <h2>DESCRIPTION :</h2>
                    <h4>{spacePage.description}</h4>
                  </div>
                  <div className="row">
                    <h2>Paramter :</h2>
                    <h4>{spacePage.paramter.map(el=>`[${el} ]`)}</h4>
                  </div>
                  <br />               
                </div>
              </div>
             <UpdateSpacePage/>
            </>
          )}
        </div>
      </div>
    </>
  );
}
