import React from "react";
import { Route, Routes } from "react-router-dom";
import Auth from "./components/auth/Auth";
import PrivateRoute from "./routing/PrivateRoute";
import Home from "./components/Home";
import ResetPassword from "./components/auth/ResetPassword";
import Sidebar from "./components/Sidebar";
import Users from "./components/auth/Users";
import Profile from "./components/auth/Profile";
import Project from "./components/Project/Project";
import Projects from "./components/Project/Projects";
import { useLocation } from "react-router";
import UpdateMyPassword from "./components/auth/UpdateMyPassword";
import UpdateMyProfile from "./components/auth/UpdateMyProfile";
import Macro from "./components/Macro/Macro";
import SpaceSetting from "./components/SpaceSetting/SpaceSetting"
import SpacePage from "./components/SpacePage/SpacePage"
import HomePageFeed from "./components/HomePageFeed/HomePageFeed"
import GlobalSetting from "./components/GlobalSetting/GlobalSetting"
import GlobalPage from "./components/GlobalPage/GlobalPage"
import ContextMenu from "./components/ContextMenu/ContextMenu";




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
            <Route path="/users" element={<Users />}/>
            <Route path="/profile" element={<Profile />}/>
            <Route path="/projects" element={<Project />}/>
            <Route path="/project/:id" element={<Projects />}/>
            <Route path="/project/:id/macro/:macroid" element={<Macro />}/>
            <Route path="/project/:id/spaceSetting/:SpaceSettingid" element={<SpaceSetting />}/>
            <Route path="/project/:id/spacePage/:SpacePageid" element={<SpacePage />}/>
            <Route path="/project/:id/homePageFeed/:HomePageFeedid" element={<HomePageFeed />}/>
            <Route path="/project/:id/globalSetting/:GlobalSettingId" element={<GlobalSetting />}/>
            <Route path="/project/:id/globalPage/:GlobalPageId" element={<GlobalPage />}/>
            <Route path="/project/:id/contextMenu/:ContextMenuId" element={<ContextMenu />}/>




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
