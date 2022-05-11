import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router";
import logoSpectrutm from "../img/logo.png";
import logo from "../images/logo.png";
import illustrationworking from "../images/illustration-working.svg"
import iconbrandrecognition from "../images/icon-brand-recognition.svg"
import icondetailedrecords from "../images/icon-detailed-records.svg"
import iconfullycustomizable from "../images/icon-fully-customizable.svg"
import logowhite from "../images/logo-white.svg"
import back2 from "../images/back2.svg"

import "../styles/home.css";

export default function Home() {
 
  const navigate = useNavigate();


  useEffect(() => {
    if (!localStorage.getItem("authToken")) {
      navigate("/auth");
    }
  }, []);

  return (
    <div  >
      <div style={{display:"flex",paddingLeft:"5.4em"}}> <img src={logo} alt="shortly" style={{width:"15em",height:"13em"}}/></div>
   


  <main className="main-container">
    <article className="section-1">

      <div className="main-info">
   <h1 className="home-title">More than just shorter links</h1>
        <p className="gray-p"> Build your Addon like never before and customize <br/> it.</p>
        <a className="cyan-btn" onClick={()=>navigate("/projects")}> Learn More</a>
      </div>
      <img src={illustrationworking} />
    </article>
 
    <article className="section-3" >

      <section className="search-result-block">
     
        <div className="hidden-result">
          <p className="inserted-link"></p>
          <hr className="result-block-hr"/>
          <div className="results">
            <p className="short-code"></p>
            <button className="copy-btn">Copy</button>
          </div>
        </div>
      </section>
      <h2 > Advanced Statistics</h2>
      <p className="info">Track how your links are performing across the web with our
        advanced statistics dashboard.</p>
      <section className="section-3-blocks ">

        <div>
          <img src={iconbrandrecognition} alt=""/>
          <h2 style={{fontSize:"1.4rem",marginTop:"2rem"}}> Step 1</h2>
          <p className="gray-p">Boost your brand recognition with each click. Generic links don’t
            mean a thing. Branded links help instil confidence in your content.</p>
        </div>
        <div>
          <img src={icondetailedrecords} alt=""/>
          <h2 style={{fontSize:"1.4rem",marginTop:"2rem"}}>Step 2</h2>
          <p className="gray-p">Gain insights into who is clicking your links. Knowing when and where
            people engage with your content helps inform better decisions.</p>
        </div>
        <div>
          <img src={iconfullycustomizable }alt=""/>
          <h2 style={{fontSize:"1.4rem",marginTop:"2rem"}}>Step 3</h2>
          <p className="gray-p"> Improve brand awareness and content discoverability through customizable
            links, supercharging audience engagement.</p>
        </div>
      </section>
    </article>
    <article className="section-1" style={{margin:"0",padding:"10.4rem 2.3rem", height:"42.5rem"}}>

      <div className="main-info">
   <h1 className="home-title">About us</h1>
        <p className="gray-p"> Build your brand's recognition and get detailed insights
          on how your links are performing.</p>
        <a className="cyan-btn" onClick={()=>navigate("/projects")}> Get Started</a>
      </div>
      <img src={back2} alt=""/>
    </article>
   
    <article className="section-4">

      <h2> Generate your Addon now</h2>
      <a className="cyan-btn" onClick={()=>navigate("/projects")}> Get Started</a>
    </article>
  </main>
 
  <footer>
    

    <section className="footer-menu">
    <p> © Copyright 2022 Spectrum Group. All rights reserved.<br/> Med Aziz Hajjem   &&   Med Dali Dellai</p>
 
    </section>
  </footer>


    </div>
  );
}
