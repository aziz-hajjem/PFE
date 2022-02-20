import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router";
import { useNavigate } from "react-router";

export default function ResetPassword() {

    const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const { token } = useParams();
  const navigate = useNavigate();
  const resetPassword = async (e) => {
    e.preventDefault();
    const config = {
      headers: { "Content-Type": "application/json" },
      // withCredentials:true
    };
    try {
      const { data } = await axios.patch(
        `http://localhost:5000/api/pfe/auth/resetpassword/${token}`,
        { password, confirmPassword },
        config
      );
      console.log(data.user);
      // const cookie = Cookies.get("jwt");
      // console.log(cookie);
      localStorage.setItem("authToken", data.token);
      if (localStorage.getItem("authToken")) {
        navigate("/home");
      }
      // if(cookie){
      //   navigate('/home')
      // }
    } catch (error) {
      setError(error.response.data.error.message);
      console.log(error.response.data.error.message);
      setTimeout(() => {
        setError("");
      }, 5000);
    }
  };
  return (
    <div >
      
        
          <form onSubmit={resetPassword} className="sign-in-form">
            <h2 className="title">Reset Password </h2>
            <div className="input-field">
              <i className="fas fa-user"></i>
              <input
                type="password"
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="input-field">
              <i className="fas fa-lock"></i>
              <input
                type="password"
                placeholder="Confirm Password"
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            <input type="submit" value="Reset" className="btn solid" />
          </form>
        
      
    </div>
  );
}
