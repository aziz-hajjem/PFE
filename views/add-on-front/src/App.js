import React from "react";
import Update from "./components/Update";
import { Route, Routes } from "react-router-dom";
import Auth from "./components/Auth";
import PrivateRoute from "./routing/PrivateRoute";
import Home from "./components/Home";
import ResetPassword from "./components/ResetPassword";
import Sidebar from "./components/Sidebar";
import Users from "./components/Users";
import { useLocation } from "react-router";

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
          </Route> 
          <Route path="/auth" element={<Auth />}></Route>
          <Route path="/resetPassword/:token" element={<ResetPassword />}></Route>

        </Routes>

    </div>
  );
}

export default App;
