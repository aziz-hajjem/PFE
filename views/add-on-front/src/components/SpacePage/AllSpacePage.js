import React, { useState, useEffect } from "react";
import { useLocation } from "react-router";
import axios from "axios";
import { useNavigate } from "react-router";
import "react-responsive-modal/styles.css";
import { Modal } from "react-responsive-modal";
import "../../styles/project.css";
import Select from "react-select";

export default function AllSpacePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [spacePages, setSpacePages] = useState();

  const getSpacePages = async () => {
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
        }:5000/api/pfe/user/projects/spacePages/allSpacePages/${
          location.pathname.split("/")[2]
        }`,
        config
      );
      console.log(data.data.spacePages);
      setSpacePages(data.data.spacePages);
    } catch (error) {
      console.log(error.response.data.error.message);
    }
  };

  useEffect(() => {
    if (!localStorage.getItem("authToken")) {
      navigate("/auth");
    }
    getSpacePages();
  }, []);
  return (
    <>
      {spacePages && spacePages.length ? (
        spacePages.map((el) => (
          <div
            onClick={() =>
              navigate(
                `/project/${location.pathname.split("/")[2]}/spacePage/${
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
        <h3>This Project didn't have any Space Pages , Please create one</h3>
      )}
    </>
  );
}
