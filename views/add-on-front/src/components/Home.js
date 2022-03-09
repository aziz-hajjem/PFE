import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router";
import plug from '../img/image.png'
import '../styles/home.css'

export default function Home() {

  const [currentUser, setCurrentUser] = useState()
  const navigate = useNavigate()

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
        "http://localhost:5000/api/pfe/user/me",
        config
      );
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
    <div style={{display:"flex",flexDirection:'column',width:"100vw"}}>
    <div className="home">
    <div className="left-box" >
        <h1>{`welcome ${currentUser && currentUser.userName} to your workspace`} </h1>

        <img src={plug}  ></img>

      </div>
      <div className="right-box">
        <h2>
          Build your add-on
        </h2>
        <h4>
          build add-on like never before
        </h4>
        <input
          readOnly
          value="Learn More"
          className="btn solid"
          style={{ textAlign: "center" }}
        />

      </div>
      
    </div>
    <div className="about-us">
      <h2>About us</h2>
      <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
      </p>
      <input
          readOnly
          value="Learn More"
          onClick={()=>navigate('/projects')}
          className="btn solid"
          style={{ textAlign: "center" }}
        />

    </div>
    <footer>
        8odwa 
        <br></br>
        ya aziz 8odwa ngedohhh
        <br></br>
        ngedohhh
      </footer>


     

    </div>
  );
}


