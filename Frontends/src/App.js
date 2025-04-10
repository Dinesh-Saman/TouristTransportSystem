import React from "react";
import "./App.css";
import { Routes, Route } from "react-router-dom";
import PackagePage from "./Pages/Packages/PackagePage";
import AddTourPackage from "./Pages/Packages/AddPackage";
import ViewPackages from "./Pages/Packages/ViewPackages";
import UpdateTourPackage from "./Pages/Packages/UpdatePackage";
import PackageReportPage from "./Pages/Packages/PackageReport";
import Header from "./Components/guest_header";
import Footer from "./Components/footer";
import Login from "./Pages/User/Login";
import TransportHome from "./Pages/Home/Home";
import ForgotPassword from './Pages/User/ForgotPassword';
import ResetPassword from './Pages/User/ResetPassword';
import ViewUsers from './Pages/User/ViewUser';
import AddUser from './Pages/User/AddUser';
import UserReportPage from './Pages/User/UserReport';
import UserRegistration from "./Pages/User/Register";
import EditProfile from "./Pages/User/EditProfile";


const App = () => {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<TransportHome />} />
        <Route path="/home" element={<TransportHome />} />
        <Route path="/login" element={< Login/>} />
        <Route path="/packages" element={<PackagePage />} />
        <Route path="/add-package" element={<AddTourPackage />} />
        <Route path="/view-packages" element={<ViewPackages />} />
        <Route path="/update-package/:id" element={<UpdateTourPackage />} />
        <Route path="/package-report" element={<PackageReportPage />} />

        <Route path="/register" element={<UserRegistration/>} />
        <Route path="/forgot-password" element={<ForgotPassword/>} />
        <Route path="/reset-password/:token" element={<ResetPassword/>} />
        <Route path="/view-user" element={<ViewUsers/>} />
        <Route path="/edit-profile" element={<EditProfile/>} />
        <Route path="/users" element={<ViewUsers/>} />
        <Route path="/add-user" element={<AddUser/>} />
        <Route path="/user-report" element={<UserReportPage/>} />
      </Routes>
      <Footer />
    </>
  );
};

export default App;
