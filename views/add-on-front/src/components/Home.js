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
   <h1 className="home-title">More than just simple App</h1>
   <br/>
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
      <h2 > How to build your Addon ?</h2>
      <p className="info">Build your Atlassian cloud apps with Forge in few steps.</p>
      <section className="section-3-blocks ">

        <div>
          <img src={iconbrandrecognition} alt=""/>
          <h2 style={{fontSize:"1.4rem",marginTop:"2rem"}}> Step 1</h2>
          <p className="gray-p">- Go to " Projects " <br/>
          - Create your own project <br/>
           </p>
        </div>
        <div>
          <img src={icondetailedrecords} alt=""/>
          <h2 style={{fontSize:"1.4rem",marginTop:"2rem"}}>Step 2</h2>
          <p className="gray-p">- Customize your Confluence <br/> UI kit components <br/>
          - Click on " Generate " button <br/>
          - Extract your project  </p>
        </div>
        <div>
          <img src={iconfullycustomizable }alt=""/>
          <h2 style={{fontSize:"1.4rem",marginTop:"2rem"}}>Step 3</h2>
          <p className="gray-p"> in your code run this commands : 
          <br/>
          - npm install <br/>
          - forge register <br/>
          - forge deploy <br/>
          - forge install</p>
        </div>
      </section>
    </article>
    <article className="section-1" style={{margin:"0",padding:"10.4rem 2.3rem", height:"42.5rem"}}>

      <div className="main-info">
   <h1 className="home-title">About us</h1>
        <p className="gray-p"> Build your Atlassian cloud apps with Forge Now ❤️.</p>
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
