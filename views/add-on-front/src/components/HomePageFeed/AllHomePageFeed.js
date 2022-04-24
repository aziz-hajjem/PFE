import React, { useState, useEffect } from "react";
import { useLocation } from "react-router";
import axios from "axios";
import { useNavigate } from "react-router";
import "react-responsive-modal/styles.css";
import { Modal } from "react-responsive-modal";
import "../../styles/project.css";
import Select from "react-select";

export default function AllHomePageFeed() {
  const navigate = useNavigate();
  const location = useLocation();
  const [homePageFeed, setHomePageFeed] = useState();

  const getHomePageFeed = async () => {
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
        }:5000/api/pfe/user/projects/homePageFeeds/allHomePageFeeds/${
          location.pathname.split("/")[2]
        }`,
        config
      );
      console.log(data.data.homePageFeeds);
      setHomePageFeed(data.data.homePageFeeds);
    } catch (error) {
      console.log(error.response.data.error.message);
    }
  };

  useEffect(() => {
    if (!localStorage.getItem("authToken")) {
      navigate("/auth");
    }
    getHomePageFeed();
  }, []);
  return (
    <>
      {homePageFeed && homePageFeed.length ? (
        homePageFeed.map((el) => (
          <div
            onClick={() =>
              navigate(
                `/project/${location.pathname.split("/")[2]}/homePageFeed/${
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
        <h3>This Project didn't have any Home Page Feeds , Please create one</h3>
      )}
    </>
  );
}
