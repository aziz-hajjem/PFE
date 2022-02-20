import React from 'react';
import {Navigate,Outlet } from 'react-router-dom';


export default function PrivateRoute() {
    // const isAuth=Cookies.get('jwt');
 
return localStorage.getItem("authToken",{withCredentials:true}) ? <Outlet /> : <Navigate to="/auth" />;
// return isAuth ? <Outlet /> : <Navigate to="/register" />;

}