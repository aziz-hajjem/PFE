import React, { useState, useEffect } from "react";
import { useLocation } from "react-router";
import axios from "axios";
import { useNavigate } from "react-router";
import "react-responsive-modal/styles.css";
import "../../styles/project.css";
import BeatLoader from "react-spinners/BeatLoader";
import { css } from "@emotion/react";


export default function AllGlobalSetting() {
  const navigate = useNavigate();
  const location = useLocation();
  const override = css`
    display: block;
    margin: auto auto;
    border-color: #231e39;
  `;
  const [globalSetting, setGlobalSetting] = useState();

  const getGlobalSetting = async () => {
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
        }:5000/api/pfe/user/projects/globalSettings/allGlobalSettings/${
          location.pathname.split("/")[2]
        }`,
        config
      );
      console.log(data.data.globalSettings);
      setGlobalSetting(data.data.globalSettings);
    } catch (error) {
      console.log(error.response.data.error.message);
    }
  };

  useEffect(() => {
    if (!localStorage.getItem("authToken")) {
      navigate("/auth");
    }
    getGlobalSetting();
  }, []);
  return (
    <>
    {globalSetting  ? (
      globalSetting.map((el) => (
        <div
          onClick={() =>
            navigate(
              `/project/${location.pathname.split("/")[2]}/globalSetting/${
                el._id
              }`
            )
          }
          className="box box-down "
          style={{
            width: "auto",
            height:"auto",
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
      <BeatLoader color="#231E39" loading={true} css={override} size={12} />
    )}
  </>
  );
}
