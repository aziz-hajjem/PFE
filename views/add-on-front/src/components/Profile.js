import React from "react";
import "../styles/profile.css";
import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";

export default function Profile() {
  const [currentUser, setCurrentUser] = useState();
  const navigate = useNavigate();
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
        "http://192.168.100.136:5000/api/pfe/user/me",
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
    <div className="containers">
      {currentUser && (
        <div className="cards-container">
          {console.log(currentUser)}
          <div className="card card-one">
            <header>
              <div className="avatar">
                {currentUser.photo && (
                  <img
                    src={require(`../img/users/${currentUser.photo}`)}
                    alt=""
                  />
                )}
              </div>
            </header>

            <h3>{currentUser && currentUser.userName}</h3>
            <div className="desc">
              <div className="prop">
                <h4>Name :</h4>
                <h5>{currentUser && currentUser.userName}</h5>
              </div>
              <div className="prop">
                <h4>Email :</h4>
                <h5>{currentUser && currentUser.email}</h5>
              </div>
              <div className="prop">
                <h4>Role :</h4>
                <h5>{currentUser && currentUser.role}</h5>
              </div>
              <div className="prop">
                <h4>Status :</h4>
                <h5>
                  {currentUser && currentUser.enable ? "Enable" : "Disable"}
                </h5>
              </div>
            </div>

            <footer></footer>
          </div>

          <div className="clear"></div>
        </div>
      )}
    </div>
  );
}
