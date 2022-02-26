import React from "react";
import Update from "./components/Update";
import { Route, Routes } from "react-router-dom";
import Auth from "./components/Auth";
import PrivateRoute from "./routing/PrivateRoute";
import Home from "./components/Home";
import ResetPassword from "./components/ResetPassword";
import Sidebar from "./components/Sidebar";
import Users from "./components/Users";
import Profile from "./components/Profile";
import Project from "./components/Project";
import Projects from "./components/Projects";
import { useLocation } from "react-router";
import UpdateMyPassword from "./components/UpdateMyPassword";
import UpdateMyProfile from "./components/UpdateMyProfile";

function App() {
  const location=useLocation()
  const dis=!location.pathname.startsWith('/auth')&&!location.pathname.startsWith("/resetPassword")?"flex":"block";


  return (
    <div className="App" style={{display:`${dis}`}}>
      {!location.pathname.startsWith('/auth')&&!location.pathname.startsWith("/resetPassword")&&<Sidebar/>}
        <Routes>
          <Route  path="/" element={<PrivateRoute />}>  
            <Route path="/" element={<Home />}/>
            <Route path="/home" element={<Home />} />
            <Route path="/update" element={<Update />}></Route>
            <Route path="/users" element={<Users />}/>
            <Route path="/profile" element={<Profile />}/>
            <Route path="/projects" element={<Project />}/>
            <Route path="/project/:id" element={<Projects />}/>
            <Route path="/updatemypassword" element={<UpdateMyPassword />}/>
            <Route path="/updatemyprofile" element={<UpdateMyProfile />}/>
          </Route> 
          <Route path="/auth" element={<Auth />}></Route>
          <Route path="/resetPassword/:token" element={<ResetPassword />}></Route>

        </Routes>

    </div>
  );
}

export default App;
