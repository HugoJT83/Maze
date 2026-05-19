import React from "react";
import { Routes, Route } from "react-router-dom";
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
import CompanyDetails from "./pages/Legal/CompanyDetails";
import PrivacyPolicy from "./pages/Legal/PrivacyPolicy";
import Accesibility from "./pages/Legal/Accesibility";
import { About } from "./pages/Legal/About";
import Terms from "./pages/Legal/Terms";
import myEvents from "./pages/Events/MyEvents";

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" Component={MainLayout}>
          <Route index Component={Home} />

          {/* Rutas protegidas */}
          <Route Component={ProtectedLayout}>
            <Route path='/dashboard' Component={Dashboard} />
            <Route path='/profile' Component={ProfileUser} />
            <Route path="/events/create-event" Component={AddEvent} />
            <Route path="/terms" Component={Terms} />
            <Route path="/my-events" Component={myEvents} />

          </Route>

          {/* Rutas - Legal */}
          <Route path="/legal" Component={CompanyDetails} />
          <Route path="/privacy-policy" Component={PrivacyPolicy} />
          <Route path="/accessibility" Component={Accesibility} />
          <Route path="/about" Component={About} />
        </Route>



        {/* Rutas de acceso a la app */}
        <Route Component={AuthLayout}>
          <Route path="/login" Component={LoginUser} />
          <Route path="/register" Component={RegisterUser} />
        </Route>
      </Routes>
    </>

  )
}

export default App