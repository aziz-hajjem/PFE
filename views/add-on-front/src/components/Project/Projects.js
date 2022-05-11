import React, { useState, useEffect } from "react";
import { useLocation } from "react-router";
import axios from "axios";
import { useNavigate } from "react-router";
import "react-responsive-modal/styles.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../../styles/project.css";
import AddMacro from "../Macro/AddMacro";
import AddSpaceSetting from "../SpaceSetting/AddSpaceSetting";
import AllSpacePage from "../SpacePage/AllSpacePage";
import AddSpacePage from "../SpacePage/AddSpacePage";
import AllSpaceSetting from "../SpaceSetting/AllSpaceSetting";
import AllMacro from "../Macro/AllMacro";
import UpdateProject from "./UpdateProject";
import AddHomePageFeed from "../HomePageFeed/AddHomePageFeed";
import AllHomePageFeed from "../HomePageFeed/AllHomePageFeed";
import AddGlobalSetting from "../GlobalSetting/AddGlobalSetting";
import AllGlobalSetting from "../GlobalSetting/AllGlobalSetting";
import AddGlobalPage from "../GlobalPage/AddGlobalPage";
import AllGlobalPage from "../GlobalPage/AllGlobalPage";
import AddContextMenu from "../ContextMenu/AddContextMenu";
import AllContextMenu from "../ContextMenu/AllContextMenu";
import AddContentByLineItem from "../ContentByLineItem/AddContentByLineItem";
import AllContentByLineItem from "../ContentByLineItem/AllContentByLineItem";
import AddContentAction from "../ContentAction/AddContentAction";
import AllContentAction from "../ContentAction/AllContentAction";
import { css } from "@emotion/react";
import ClockLoader from "react-spinners/ClockLoader";

const FileDownload = require("js-file-download");

export default function Projects() {
  const navigate = useNavigate();
  const location = useLocation();
  const [project, setProject] = useState();


  const override = css`
    display: block;
    margin: auto auto;
    border-color: #231e39;
  `;
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
        `http://${
          process.env.REACT_APP_IP_ADDRESS
        }:5000/api/pfe/user/projects/${location.pathname.split("/")[2]}`,
        config
      );
      setProject(data.data.project);
    } catch (error) {
      console.log(error.response.data.error.message);
    }
  };
  const generate = async () => {
    const config = {
      responseType: "arraybuffer",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
      withCredentials: true,
    };
    try {
      const { data } = await axios.get(
        `http://${
          process.env.REACT_APP_IP_ADDRESS
        }:5000/api/pfe/user/projects/${
          location.pathname.split("/")[2]
        }/generate`,
        config
      );
      project && FileDownload(data, `${project.name}.zip`);
      toast.success(" Succes , Please check your downloads !", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } catch (error) {
      console.log(error.message);
    }
  };

  const deleteProject = async (project) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
      withCredentials: true,
    };
    try {
      const { data } = await axios.delete(
        `http://${process.env.REACT_APP_IP_ADDRESS}:5000/api/pfe/user/projects/${project._id}`,
        config
      );
      navigate("/projects");
    } catch (error) {
      console.log(error.response);
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
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
{
  project?(
    <div className="Project-container">
    <div></div>
    <div className="container-box">
      {project && (
        <>
          <div
            className="project  "
            style={{
              borderTop: `3px solid #${Math.floor(
                Math.random() * 16777215
              ).toString(16)}`,
            }}
          >
            <div className="box-header-container">
              <div className="box-header">
                {project.icon && (
                  <img
                    style={{ width: "5em", height: "5em" }}
                    src={require(`../../img/icons/${project.icon}`)}
                    alt=""
                  />
                )}
                <h2>{project.name}</h2>
              </div>
              <a
                onClick={() => project &&window.confirm("Are you sure to delete This project ?")&&deleteProject(project)}
                className="close"
              ></a>
            </div>
            <div className="content">
              <div className="row" style={{gap:"6em"}}>
                <h2>NAME :</h2>
                <h4>{project.name}</h4>
              </div>
              <div className="row" style={{gap:"6em"}}>
                <h2>KEY :</h2>
                <h4>{project.key}</h4>
              </div>
              <div className="row" style={{gap:"6em"}}>
                <h2>DESCRIPTION :</h2>
                <h4>{project.description}</h4>
              </div>
              <div
                className="row"
                style={{
                  justifyContent: "space-between",
                  
                }}
              >
                <h2>Macros :</h2>
                <AddMacro />
              </div>

              <br />
              <div
                style={{
                  display: "flex",
                  gap: "2em",
                  alignItems: "center",
                  flexDirection: "row",
                  flexFlow:"wrap"
                }}
              >
                <AllMacro />
              </div>
              <div
                className="row"
                style={{
                  justifyContent: "space-between",
                  
                }}
              >
                <h2>Space Settings :</h2>
                <AddSpaceSetting />
              </div>
              <br />
              <div
                style={{
                  display: "flex",
                  gap: "2em",
                  alignItems: "center",
                  flexDirection: "row",
                  flexFlow:"wrap"
                }}
              >
                <AllSpaceSetting />
              </div>
              <div
                className="row"
                style={{
                  justifyContent: "space-between",
                  
                }}
              >
                <h2>Space Pages :</h2>
                <AddSpacePage />
              </div>
              <br />
              <div
                style={{
                  display: "flex",
                  gap: "2em",
                  alignItems: "center",
                  flexDirection: "row",
                  flexFlow:"wrap"
                }}
              >
                <AllSpacePage />
              </div>
              <div
                className="row"
                style={{
                  justifyContent: "space-between",
                  
                }}
              >
                <h2>Home Page Feed :</h2>
                <AddHomePageFeed />
              </div>
              <br />
              <div
                style={{
                  display: "flex",
                  gap: "2em",
                  alignItems: "center",
                  flexDirection: "row",
                  flexFlow:"wrap"
                }}
              >
                <AllHomePageFeed />
              </div>
              <div
                className="row"
                style={{
                  justifyContent: "space-between",
                  
                }}
              >
                <h2>Global Setting :</h2>
                <AddGlobalSetting />
              </div>
              <br />
              <div
                style={{
                  display: "flex",
                  gap: "2em",
                  alignItems: "center",
                  flexDirection: "row",
                  flexFlow:"wrap"
                }}
              >
                <AllGlobalSetting />
              </div>
              <div
                className="row"
                style={{
                  justifyContent: "space-between",
                  
                }}
              >
                <h2>Global Page :</h2>
                <AddGlobalPage />
              </div>
              <br />
              <div
                style={{
                  display: "flex",
                  gap: "2em",
                  alignItems: "center",
                  flexDirection: "row",
                  flexFlow:"wrap"
                }}
              >
                <AllGlobalPage />
              </div>
              {/* <div
                className="row"
                style={{
                  justifyContent: "space-between",
                  
                }}
              >
                <h2>Context Menu :</h2>
                <AddContextMenu />
              </div>
              <br />
              <div
                style={{
                  display: "flex",
                  gap: "2em",
                  alignItems: "center",
                  flexDirection: "row",
                  flexFlow:"wrap"
                }}
              >
                <AllContextMenu />
              </div> 
               <div
                className="row"
                style={{
                  justifyContent: "space-between",
                  
                }}
              >
                <h2>Content By Line Item :</h2>
                <AddContentByLineItem />
              </div>
              <br />
              <div
                style={{
                  display: "flex",
                  gap: "2em",
                  alignItems: "center",
                  flexDirection: "row",
                  flexFlow:"wrap"
                }}
              >
                <AllContentByLineItem />
              </div> 
              <div
                className="row"
                style={{
                  justifyContent: "space-between",
                  
                }}
              >
                <h2>ContentAction :</h2>
                <AddContentAction />
              </div>
              <br />
              <div
                style={{
                  display: "flex",
                  gap: "2em",
                  alignItems: "center",
                  flexDirection: "row",
                  flexFlow:"wrap"
                }}
              >
                <AllContentAction />
              </div> */}

            </div>
          </div>
          <UpdateProject />
          <div>
          <div id="container" onClick={generate}>
          <button className="learn-more">
            <span className="circle" aria-hidden="true">
              <span className="icon arrow"></span>
            </span>
            <span className="button-text">Generate</span>
          </button>
        </div>
          </div>
        </>
      )}
    </div>
  </div>
  ):( <ClockLoader color="#231E39" loading={true} css={override} size={150} />)
}
    </>
  );
}
