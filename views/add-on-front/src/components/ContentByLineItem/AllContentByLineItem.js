import React, { useState, useEffect } from "react";
import { useLocation } from "react-router";
import axios from "axios";
import { useNavigate } from "react-router";
import "react-responsive-modal/styles.css";
import "../../styles/project.css";

export default function AllContentByLineItem() {
  const navigate = useNavigate();
  const location = useLocation();
  const [ContentByLineItem, setContentByLineItems] = useState();

  const getContentByLineItem = async () => {
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
        }:5000/api/pfe/user/projects/contentByLineItems/allContentByLineItems/${
          location.pathname.split("/")[2]
        }`,
        config
      );
      console.log(data.data.contentByLineItems);
      setContentByLineItems(data.data.contentByLineItems);
    } catch (error) {
      console.log(error.response.data.error.message);
    }
  };

  useEffect(() => {
    if (!localStorage.getItem("authToken")) {
      navigate("/auth");
    }
    getContentByLineItem();
  }, []);
  return (
    <>
      {ContentByLineItem && ContentByLineItem.length ? (
        ContentByLineItem.map((el) => (
          <div
            onClick={() =>
              navigate(
                `/project/${location.pathname.split("/")[2]}/ContentByLineItem/${
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
        <h3>This Project didn't have any Content By Line Item , Please create one</h3>
      )}
    </>
  );
}
