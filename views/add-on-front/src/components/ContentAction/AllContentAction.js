import React, { useState, useEffect } from "react";
import { useLocation } from "react-router";
import axios from "axios";
import { useNavigate } from "react-router";
import "react-responsive-modal/styles.css";
import "../../styles/project.css";

export default function AllContentAction() {
  const navigate = useNavigate();
  const location = useLocation();
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
      {contentAction && contentAction.length ? (
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
              width: "100%",
              border: `2px solid #${Math.floor(
                Math.random() * 16777215
              ).toString(16)}`,
            }}
            key={el._id}
          >
            <div
              style={{
                display: "flex",
                gap: "20%",
                alignItems: "center",
              }}
            >
              <h2>{el.name}</h2>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
              }}
            >
              <p>{el.description}</p>
            </div>
          </div>
        ))
      ) : (
        <h3>This Project didn't have any Content Action , Please create one</h3>
      )}
    </>
  );
}
