import React, { useState, useEffect } from "react";
import { useLocation } from "react-router";
import axios from "axios";
import { useNavigate } from "react-router";
import "react-responsive-modal/styles.css";
import "../../styles/project.css";
import BeatLoader from "react-spinners/BeatLoader";
import { css } from "@emotion/react";


export default function AllContentAction() {
  const navigate = useNavigate();
  const location = useLocation();
  const override = css`
    display: block;
    margin: auto auto;
    border-color: #231e39;
  `;
  const [contentAction, setContentAction] = useState();

  const getcontentAction = async () => {
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
        }:5000/api/pfe/user/projects/contentActions/allContentActions/${
          location.pathname.split("/")[2]
        }`,
        config
      );
      console.log(data.data.contentActions);
      setContentAction(data.data.contentActions);
    } catch (error) {
      console.log(error.response.data);
    }
  };

  useEffect(() => {
    if (!localStorage.getItem("authToken")) {
      navigate("/auth");
    }
    getcontentAction();
  }, []);
  return (
    <>
    {contentAction  ? (
      contentAction.map((el) => (
        <div
          onClick={() =>
            navigate(
              `/project/${location.pathname.split("/")[2]}/contentAction/${
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
