import React, { useState, useEffect } from "react";
import { useLocation } from "react-router";
import axios from "axios";
import { useNavigate } from "react-router";
import "../styles/project.css";

export default function Projects() {
  const navigate = useNavigate();
  const location = useLocation();
  const [project, setProject] = useState();
  console.log(location.pathname.split("/")[2]);
  const getProject = async () => {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
      withCredentials: true,
    };
    try {
      const { data } = await axios.get(
        `http://localhost:5000/api/pfe/user/projects/${
          location.pathname.split("/")[2]
        }`,
        config
      );
      console.log(data.data.project);
      setProject(data.data.project);
    } catch (error) {
      console.log(error.response.data.error.message);
    }
  };
  useEffect(() => {
    if (!localStorage.getItem("authToken")) {
      navigate("/auth");
    }

    getProject();
  }, []);
  return (
    <>
      <div className="Projects-container">
        <div
          style={{
            padding: "2em",
            height: "100%",
            display: "flex",
            gap: "2em",
            alignItems: "center",
            flexDirection: "column",
          }}
        >
            {project&&(<>
                <div
              className="box box-down "
              style={{
                  display:"flex",
                  flexDirection:"column",
                  padding:"2em",
                  gap:"10em",
                borderTop: `3px solid #${Math.floor(
                  Math.random() * 16777215
                ).toString(16)}`,
              }}
              
            >
              <div style={{display:'flex',alignItems:"center",gap:"36%",paddingLeft:"3em"}}>
             {project.icon&& <img
                style={{ width: "5em", height: "5em" }}
                src={require(`../img/icons/${project.icon}`)}
                alt=""
              />}
              
              <h2>{project.name}</h2>
              
              </div>
              <div className="content" >
                  <div className="row">
                      <h2 >NAME :</h2>
                      <h4>{project.name}</h4>
                  </div>
                  <div className="row"  >
                      <h2 >KEY :</h2>
                      <h4>{project.key}</h4>
                  </div>
                  <div className="row"  >
                      <h2 >DESCRIPTION :</h2>
                      <h4>{project.description}</h4>
                  </div>
                  <div className="row"  >
                      <h2 >VENDOR NAME :</h2>
                      <h4>{project.vendor.name}</h4>
                  </div>
                  <div className="row"  >
                      <h2 >VENDOR URL :</h2>
                      <h4>{project.vendor.url}</h4>
                  </div>
                  <div className="row"  >
                      <h2 >AUTHENTICATION :</h2>
                      <h4>{project.authentication}</h4>
                  </div>
                  <div className="row"  >
                      <h2 >ENABLE LICENSING :</h2>
                      <h4>{project.enableLicensing.toString()}</h4>
                  </div>

              </div>


           
            </div>

            </>)}
        </div>
      </div>
    </>
  );
}
