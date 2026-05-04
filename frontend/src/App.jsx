import React from "react";
import { Routes,Route   } from "react-router-dom";
import Home from "./pages/Home";
import Footer from "./components/Footer";
import LoginUser from "./pages/auth/LoginUser";
import RegisterUser from "./pages/auth/RegisterUser";
import MainLayout from "./Layouts/MainLayout";
import AuthLayout from "./Layouts/AuthLayout";
import { Dashboard } from "./pages/Dashboard";
import ProtectedLayout from "./Layouts/ProtectedLayout";
import ProfileUser from "./pages/auth/ProfileUser";
import AddEvent from "./pages/Events/AddEvent";
import eventSuccess from "./pages/Events/EventSuccess";

const App = () => {
  return (
    <> 
      <Routes>
        <Route path="/" Component={MainLayout}> 
          <Route index Component={Home}/>
          
          {/* Rutas protegidas */}
          <Route Component={ProtectedLayout}>
            <Route path='/dashboard' Component={Dashboard}/>
            <Route path='/profile' Component={ProfileUser}/>
            <Route path="/events/create-event" Component={AddEvent}/>
          </Route>
        </Route>

        
        {/* Rutas de acceso a la app */}
        <Route Component={AuthLayout}>
          <Route path="/login" Component={LoginUser}/>
          <Route path="/register" Component={RegisterUser}/>
        </Route>

        

      </Routes>
    </>
    
  )
}

export default App