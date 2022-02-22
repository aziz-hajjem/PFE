import React from 'react'
import { useState,useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from "react-router";


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
    <div>
        {projects&&projects.length?projects.map(el=>(
            <div>{el.name}{el._id}</div>
        )):(<h1>This user didn't have projects</h1>)}
    </div>
  )
}
