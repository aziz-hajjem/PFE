import {
  ProSidebar,
  SidebarHeader,
  SidebarFooter,
  SidebarContent,
  Menu,
  MenuItem,
  SubMenu,
} from "react-pro-sidebar";
import "react-pro-sidebar/dist/css/styles.css";
import { MdLogout, MdSecurity, MdBuild, MdMenu } from "react-icons/md";
import { FaUsers } from "react-icons/fa";
import { FiHome } from "react-icons/fi";
import { GoSettings, GoProject } from "react-icons/go";
import { useNavigate } from "react-router";
import axios from "axios";
import { useState, useEffect } from "react";

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(true);
  const [currentUser, setCurrentUser] = useState();
  const navigate = useNavigate();
  const logoutHandler = () => {
    localStorage.removeItem("authToken");
    navigate("/auth");
  };
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
        `http://${process.env.REACT_APP_IP_ADDRESS}:5000/api/pfe/user/me`,
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
    <>
      {currentUser && (
        <ProSidebar
          className="side"
          collapsed={collapsed}
          style={{ height: "auto", margin: "0px" }}
          
        >
          <SidebarHeader>
            <Menu>
              <MenuItem
                onClick={() => setCollapsed(!collapsed)}
                icon={<MdMenu style={{ width: "25px", height: "25px" }} />}
              >
                <h1
                  style={{
                    display: "flex",
                    alignItems: "center",
                    textAlign: "center",
                    justifyContent: "center",
                    color: "hsl(0, 0%, 98%)",
                  }}
                >
                  Addons <br /> Generator
                </h1>
              </MenuItem>
            </Menu>
          </SidebarHeader>

          <SidebarContent
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <Menu iconShape="circle" popperArrow={true}>
              <MenuItem
                onClick={() => navigate("/home")}
                icon={<FiHome style={{ width: "20px", height: "20px" }} />}
              >
                Home
              </MenuItem>
              <MenuItem
                onClick={() => navigate("/profile")}
                // icon={<GrDocker style={{ width: "20px", height: "20px" }} />}
                icon={
                  currentUser.photo && (
                    <img
                      src={require(`../img/users/${currentUser.photo}`)}
                      alt=""
                      style={{
                        width: "35px",
                        height: "35px",
                        borderRadius: "50%",
                      }}
                    />
                  )
                }
              >
                {currentUser.userName}
                {/* <Link to={{pathname:"/update" ,state:{currentUser}}}/> */}
              </MenuItem>
              {currentUser.role === "admin" && (
                <MenuItem
                  onClick={() => navigate("/users")}
                  icon={<FaUsers style={{ width: "20px", height: "20px" }} />}
                >
                  Users
                </MenuItem>
              )}
              <MenuItem
                onClick={() => navigate("/projects")}
                icon={<GoProject style={{ width: "20px", height: "20px" }} />}
              >
                Projects
              </MenuItem>
            </Menu>
            <Menu>
              <SubMenu
                title="Settings"
                icon={<GoSettings style={{ width: "20px", height: "20px" }} />}
              >
                <MenuItem
                  onClick={() => navigate("/updatemyprofile")}
                  icon={<MdBuild style={{ width: "20px", height: "20px" }} />}
                >
                  Confidientiality
                </MenuItem>
                <MenuItem
                  icon={
                    <MdSecurity style={{ width: "20px", height: "20px" }} />
                  }
                  onClick={() => navigate("/updatemypassword")}
                >
                  Security
                </MenuItem>
              </SubMenu>
            </Menu>
          </SidebarContent>
          <SidebarFooter>
            <Menu>
  
              <MenuItem
                onClick={logoutHandler}
                icon={<MdLogout style={{ width: "20px", height: "20px" }} />}
              >
                <p>Logout</p>
              </MenuItem>
            </Menu>
          </SidebarFooter>
        </ProSidebar>
      )}
    </>
  );
}
