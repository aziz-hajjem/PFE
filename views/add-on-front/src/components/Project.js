import React from 'react'
import { useState,useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from "react-router";
import "../styles/projects.css"


export default function Project() {
    const navigate=useNavigate()
    const [projects,setProjects]=useState()
    const getProjects = async () => {
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
          withCredentials: true,
        };
        try {
          const { data } = await axios.get(
            "http://localhost:5000/api/pfe/user/projects/allProjects",
            config
          );
          console.log(data);
          setProjects(data.data.projects);
        } catch (error) {
          
          console.log(error.response.data.error.message);
        }
      };
      useEffect(() => {
        if (!localStorage.getItem("authToken")) {
          navigate("/auth");
        }
    
        getProjects();
      }, []);
  return (
    <div  className="Projects-container">
          {/* {projects&&projects.length||<h1>This user didn't have any project ,Please Create one 😄</h1>}     */}

        {/* {projects&&projects.length?projects.map(el=>(
            <div>{el.name}{el._id}</div>
        )):(<h1>This user didn't have projects</h1>)} */}
        <div style={{padding:"2em",height:"100%",display:"flex",gap:"2em",alignItems:"center",flexDirection:"column"}}>
    {projects&&projects.map(el=>(
      
      <div className="box box-down " style={{borderTop:`3px solid #${Math.floor(Math.random()*16777215).toString(16)}`}} key={el._id}>
      <h2>{el.name}</h2>
      <p>{el.description}</p>
      <img style={{width:"5em",height:"5em"}} src={require(`../img/icons/${el.icon}`)} alt=""/>
    </div>
    
      
    ))}
</div>
        

    </div>
  )
}
