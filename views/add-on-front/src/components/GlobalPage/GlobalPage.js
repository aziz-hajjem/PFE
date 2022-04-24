import React, { useState, useEffect } from "react";
import { useLocation } from "react-router";
import axios from "axios";
import { useNavigate } from "react-router";
import "react-responsive-modal/styles.css";
import "../../styles/project.css";
import UpdateGlobalPage from "./UpdateGlobalPage";


export default function GlobalPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [globalPage, setGlobalPage] = useState();


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
        `http://${process.env.REACT_APP_IP_ADDRESS}:5000/api/pfe/user/projects/globalPages/${
          location.pathname.split("/")[2]
        }/${location.pathname.split("/")[4]}`,
        config
      );
      console.log(data.data.globalPage);
      setGlobalPage(data.data.globalPage);
    } catch (error) {
      console.log(error.response.data.error.message);
    }
  };
  
  const deleteglobalPage = async () => {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
      withCredentials: true,
    };
    try {
      const { data } = await axios.delete(
        `http://${process.env.REACT_APP_IP_ADDRESS}:5000/api/pfe/user/projects/globalPages/${
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
    getglobalPage();
  }, []);
  return (
    <>
      <div className="Project-container">
        <div className="container-box">
          {globalPage && (
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
                    <h2>{globalPage.name}</h2>
                  </div>
                  <a onClick={deleteglobalPage} className="close"></a>
                </div>
                <div className="content">
                  <div className="row">
                    <h2>NAME :</h2>
                    <h4>{globalPage.name}</h4>
                  </div>
                  <div className="row">
                    <h2>KEY :</h2>
                    <h4>{globalPage.key}</h4>
                  </div>
                  <div className="row">
                    <h2>DESCRIPTION :</h2>
                    <h4>{globalPage.description}</h4>
                  </div>
                  <div className="row">
                    <h2>Paramter :</h2>
                    <h4>{globalPage.paramter.map(el=>`[${el} ]`)}</h4>
                  </div>
                  <br />               
                </div>
              </div>
             <UpdateGlobalPage/>
            </>
          )}
        </div>
      </div>
    </>
  );
}
