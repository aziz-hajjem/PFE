import React, { useState, useEffect } from "react";
import { useLocation } from "react-router";
import axios from "axios";
import { useNavigate } from "react-router";
import "react-responsive-modal/styles.css";
import "../../styles/project.css";

export default function AllSpaceSetting() {
  const navigate = useNavigate();
  const location = useLocation();
  const [spaceSettings, setSpaceSettings] = useState();

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
  useEffect(() => {
    if (!localStorage.getItem("authToken")) {
      navigate("/auth");
    }

    getSpaceSettings();
  }, []);
  return (
    <>
      {spaceSettings && spaceSettings.length ? (
        spaceSettings.map((el) => (
          <div
            onClick={() =>
              navigate(
                `/project/${location.pathname.split("/")[2]}/spaceSetting/${
                  el._id
                }`
              )
            }
            className="box box-down "
            style={{
              width: "auto",
              height: "auto",
              border: `2px solid #${Math.floor(
                Math.random() * 16777215
              ).toString(16)}`,
            }}
            key={el._id}
          >
            <div
              style={{
                display: "flex",
                fontSize:"70%",
                alignItems: "center",
              }}
            >
              <h2>{el.name}</h2>
            </div>
          </div>
        ))
      ) : (
        <h3>This Project didn't have any Space Settings , Please create one</h3>
      )}
    </>
  );
}
