import "../styles/auth.css";
import "react-responsive-modal/styles.css";
import { Modal } from "react-responsive-modal";

import React, { useState,useEffect } from "react";
import { useNavigate } from "react-router";
import axios from 'axios';




export default function Auth() {
    const [open, setOpen] = useState(false);
    const onOpenModal = () => setOpen(true);
    const onCloseModal = () => setOpen(false);
    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [signUpError, setSignUpError] = useState("");
    const [logInError, setLogInError] = useState("");
    const [error, setError] = useState("");
  const [sendEmail,setSendEmail]=useState("")
  const forgotPassword = async (e) => {
    e.preventDefault();
    const config = {
      headers: { "Content-Type": "application/json" },
      // withCredentials:true
    };
    try {
      const { data } = await axios.post(
        "http://192.168.100.136:5000/api/pfe/auth/forgotpassword",
        {email},
        config
      );
      console.log(data);
      if(data.status==="Succes"){
        setSendEmail("An email was sent succesfully \nPlease Check your email ✔️")
      }
      
      

    } catch (error) {
      setError(error.response.data.error.message);

      console.log(error.response.data.error.message);
      setTimeout(() => {
        setError("");
      }, 5000);
    }
  };
    const navigate = useNavigate();
    useEffect(() => {
      if (localStorage.getItem("authToken")) {
        navigate("/");
      }
    }, [navigate]);
    const signUpHandler = async (e) => {
      e.preventDefault();
      const config = {
        headers: { "Content-Type": "application/json" },
      };
      try {
        const { data } = await axios.post(
          "http://192.168.100.136:5000/api/pfe/auth/signup",
          { userName, email, password, confirmPassword },
          config
        );
        // console.log(data);
 
  
        localStorage.setItem("authToken", data.data.token);
        if (localStorage.getItem("authToken")) {
          navigate("/",{state:data.data.newUser})}
  

      } catch (error) {
        setSignUpError(error.response.data.error.message);
        console.log(error.response.data.error.message);
        setTimeout(() => {
          setSignUpError("");
        }, 5000);
      }
    };
    const loginHandler = async (e) => {
      e.preventDefault();
      const config = {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      };
      try {
        const { data } = await axios.post(
          "http://192.168.100.136:5000/api/pfe/auth/login",
          { email, password },
          config
        );
        localStorage.setItem('authToken',data.data.token)
        if(localStorage.getItem("authToken")){
          
          navigate('/',{state:data.data.user})
        }
        
       
        
      } catch (error) {
        setLogInError(error.response.data.error.message);
        console.log(error.response.data.error.message);
        setTimeout(() => {
          setLogInError("");
        }, 5000);
      }
    };
  return (
    <div>
        <Modal open={open} onClose={onCloseModal} center classNames="modal">
        <form onSubmit={forgotPassword} className="sign-in-form">
          <h2 className="title">Please provide your email </h2>
          {sendEmail&&<span>{sendEmail}</span>}
          {error&&<h5 style={{color:"#ff3333"}}>{error}</h5>}
          <div className="input-field">
            <i className="fas fa-user"></i>
            <input type="email" placeholder="Email" onChange={(e)=>setEmail(e.target.value)} />
          </div>
          <input type="submit" value="Submit" className="btn solid"  />
        </form>
      </Modal>
      <div className="container">
        <div className="forms-container">
          <div className="signin-signup">
            <form onSubmit={loginHandler} className="sign-in-form">
              <h2 className="title">Log in</h2>
              {logInError&&<h5 style={{color:"#ff3333"}}>{logInError}</h5>}
              <div className="input-field">
                <i className="fas fa-user"></i>
                <input type="email" placeholder="Email" onChange={(e)=>setEmail(e.target.value)} />
              </div>
              <div className="input-field">
                <i className="fas fa-lock"></i>
                <input type="password" placeholder="Password"onChange={(e)=>setPassword(e.target.value)} />
              </div>
              <a href="#" onClick={onOpenModal}>
                Forgot Password ?
              </a>
              <input type="submit" value="Login" className="btn solid" />
            </form>
            <form onSubmit={signUpHandler} className="sign-up-form">
              <h2 className="title">Register</h2>
              {signUpError&&<h5 style={{color:"#ff3333"}}>{signUpError}</h5>}
              <div className="input-field">
                <i className="fas fa-user"></i>
                <input type="text" placeholder="Username" onChange={(e)=>setUserName(e.target.value)}/>
              </div>
              <div className="input-field">
                <i className="fas fa-envelope"></i>
                <input type="email" placeholder="Email" onChange={(e)=>setEmail(e.target.value)} />
              </div>
              <div className="input-field">
                <i className="fas fa-lock"></i>
                <input type="password" placeholder="Password" onChange={(e)=>setPassword(e.target.value)}/>
              </div>
              <div className="input-field">
                <i className="fas fa-lock"></i>
                <input type="password" placeholder="Confirm Password" onChange={(e)=>setConfirmPassword(e.target.value)}/>
              </div>
              <input type="submit" className="btn" value="Register" />
            </form>
          </div>
        </div>

        <div className="panels-container">
          <div className="panel left-panel">
            <div className="content">
              <h3>New here ?</h3>
              <p>
                Doesn't have any account yet to get into our webpage, Willing to
                join our community...!
              </p>
              <button
                className="btn transparent"
                id="sign-up-btn"
                onClick={() =>
                  document
                    .querySelector(".container")
                    .classList.add("sign-up-mode")
                }
              >
                Register
              </button>
            </div>
          </div>
          <div className="panel right-panel">
            <div className="content">
              <h3>One of us ?</h3>
              <p>
                Has an account to use our serices, Already a member of our
                prosperous community.
              </p>
              <button
                className="btn transparent"
                id="sign-in-btn"
                onClick={() =>
                  document
                    .querySelector(".container")
                    .classList.remove("sign-up-mode")
                }
              >
                Log in
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
