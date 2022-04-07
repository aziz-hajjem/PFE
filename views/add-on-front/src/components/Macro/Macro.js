import React, { useState, useEffect } from "react";
import { useLocation } from "react-router";
import axios from "axios";
import { useNavigate } from "react-router";
import "react-responsive-modal/styles.css";
import UpdateMacro from "./UpdateMacro"



export default function Macro() {
  const navigate = useNavigate();
  const location = useLocation();
  const [macro, setMacro] = useState();
  
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
        `http://${process.env.REACT_APP_IP_ADDRESS}:5000/api/pfe/user/projects/macros/${
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
        `http://${process.env.REACT_APP_IP_ADDRESS}:5000/api/pfe/user/projects/macros/${
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

    getMacro();
  }, []);
  return (
    <> 
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
                        src={require(`../../img/macros/${macro.icon}`)}
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
                    <h2>Paramter :</h2>
                    <h4>{macro.parameter}</h4>
                  </div>

                  <br />

                </div>
              </div>
              <UpdateMacro/>
            </>
          )}
        </div>
      </div>
    </>
  );
}
