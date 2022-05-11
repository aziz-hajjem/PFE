import React from "react";
import "../../styles/profile.css";
import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { css } from "@emotion/react";
import ClockLoader from "react-spinners/ClockLoader";

export default function Profile() {
  const [currentUser, setCurrentUser] = useState();
  const navigate = useNavigate();
  const override = css`
    display: block;
    margin: auto auto;
    border-color: #231e39;
  `;
  const getMe = async () => {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
      withCredentials: true,
    };
    try {
      const { data } = await axios.get(
        `http://${process.env.REACT_APP_IP_ADDRESS}:5000/api/pfe/user/me`,
        config
      );
      // console.log(data)
      setCurrentUser(data.data.me);
    } catch (error) {
      console.log(error.response.data.error.message);
    }
  };
  useEffect(() => {
    if (!localStorage.getItem("authToken")) {
      navigate("/auth");
    }

    getMe();
  }, []);
  return (
    <>
      {currentUser ? (
        <div className="body-profile">
          <div className="card-container">
            <div
              style={{ display: "flex", flexDirection: "column", gap: "0.5em" }}
            >
              <span className="pro">{currentUser && currentUser.role}</span>
              {currentUser && (
                <img
                  className="round"
                  src={require(`../../img/users/${
                    currentUser && currentUser.photo
                  }`)}
                  alt=""
                />
              )}

              <h3>{currentUser && currentUser.userName}</h3>
            </div>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "2.5em" }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.15em",
                  justifyContent: "center",
                  paddingLeft: "1em",
                }}
              >
                <div className="prop">
                  <h6>Name :</h6>
                  <p>{currentUser && currentUser.userName}</p>
                </div>
                <div className="prop">
                  <h6>Email :</h6>
                  <p>{currentUser && currentUser.email}</p>
                </div>
                <div className="prop">
                  <h6>Status :</h6>
                  <p>
                    {currentUser && currentUser.enable ? "Enable" : "Disable"}
                  </p>
                </div>
              </div>
              <div className="buttons">
                <button
                  className="primary ghost"
                  onClick={() => navigate("/projects")}
                >
                  Your projects
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <ClockLoader color="#231E39" loading={true} css={override} size={150} />
      )}
    </>
  );
}
