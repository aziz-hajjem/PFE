import React, { useState, useEffect } from "react";
import { useLocation } from "react-router";
import axios from "axios";
import { useNavigate } from "react-router";
import "react-responsive-modal/styles.css";
import "../../styles/project.css";
import UpdateContentByLineItem from "./UpdateContentByLineItem";


import { css } from "@emotion/react";
import ClockLoader from "react-spinners/ClockLoader";

export default function ContentByLineItem() {
  const navigate = useNavigate();
  const location = useLocation();  
  const override = css`
    display: block;
    margin: auto auto;
    border-color: #231e39;
  `;
  const [contentByLineItem, setContentByLineItem] = useState();


  const getcontentByLineItem = async () => {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
      withCredentials: true,
    };
    try {
      const { data } = await axios.get(
        `http://${process.env.REACT_APP_IP_ADDRESS}:5000/api/pfe/user/projects/contentByLineItems/${
          location.pathname.split("/")[2]
        }/${location.pathname.split("/")[4]}`,
        config
      );
      console.log(data.data.contentByLineItem);
      setContentByLineItem(data.data.contentByLineItem);
    } catch (error) {
      console.log(error.response.data.error.message);
    }
  };
  
  const deletecontentByLineItem = async () => {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
      withCredentials: true,
    };
    try {
      const { data } = await axios.delete(
        `http://${process.env.REACT_APP_IP_ADDRESS}:5000/api/pfe/user/projects/contentByLineItems/${
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
    getcontentByLineItem();
  }, []);
  return (
    <>
      {contentByLineItem?(
        <div className="Project-container">
        <div className="container-box">
          {contentByLineItem && (
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
                    <h2>{contentByLineItem.name}</h2>
                  </div>
                  <a onClick={()=>window.confirm("Are you sure to delete this ?")&&deletecontentByLineItem()} className="close"></a>
                </div>
                <div className="content">
                  <div className="row">
                    <h2>NAME :</h2>
                    <h4>{contentByLineItem.name}</h4>
                  </div>
                  <div className="row">
                    <h2>KEY :</h2>
                    <h4>{contentByLineItem.key}</h4>
                  </div>
                  <div className="row">
                    <h2>Tooltip :</h2>
                    <h4>{contentByLineItem.tooltip}</h4>
                  </div>
                  <div className="row">
                    <h2>DESCRIPTION :</h2>
                    <h4>{contentByLineItem.description}</h4>
                  </div>
                  <div className="row">
                    <h2>Paramter :</h2>
                    <h4>{contentByLineItem.paramter.map(el=>`[${el} ]`)}</h4>
                  </div>
                  <br />               
                </div>
              </div>
             <UpdateContentByLineItem/>
            </>
          )}
        </div>
      </div>
      ):(
        <ClockLoader color="#231E39" loading={true} css={override} size={150} />

      )}
    </>
  );
}
