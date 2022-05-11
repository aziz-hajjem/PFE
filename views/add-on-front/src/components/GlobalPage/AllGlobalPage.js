import React, { useState, useEffect } from "react";
import { useLocation } from "react-router";
import axios from "axios";
import { useNavigate } from "react-router";
import "react-responsive-modal/styles.css";
import "../../styles/project.css";
import BeatLoader from "react-spinners/BeatLoader";
import { css } from "@emotion/react";


export default function AllglobalPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const override = css`
    display: block;
    margin: auto auto;
    border-color: #231e39;
  `;
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
        `http://${
          process.env.REACT_APP_IP_ADDRESS
        }:5000/api/pfe/user/projects/globalPages/allglobalPages/${
          location.pathname.split("/")[2]
        }`,
        config
      );
      console.log(data.data.globalPages);
      setGlobalPage(data.data.globalPages);
    } catch (error) {
      console.log(error.response.data.error.message);
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
    {globalPage  ? (
      globalPage.map((el) => (
        <div
          onClick={() =>
            navigate(
              `/project/${location.pathname.split("/")[2]}/globalPage/${
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
