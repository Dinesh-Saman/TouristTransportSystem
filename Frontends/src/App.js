import React from "react";
import "./App.css";
import { Routes, Route } from "react-router-dom";
import PackagesPage from "./Pages/PackagePage";
import AddTourPackage from "./Pages/AddPackage";
import ViewPackages from "./Pages/ViewPackages";
import UpdateTourPackage from "./Pages/UpdatePackage";
import PackageReportPage from "./Pages/PackageReport";
import Header from "./Components/guest_header";
import Footer from "./Components/footer";
import Login from "./Pages/Login";
import TransportHome from "./Pages/Home";


const App = () => {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<TransportHome />} />
        <Route path="/home" element={<TransportHome />} />
        <Route path="/login" element={< Login/>} />
        <Route path="/packages" element={<PackagesPage />} />
        <Route path="/add-package" element={<AddTourPackage />} />
        <Route path="/view-packages" element={<ViewPackages />} />
        <Route path="/update-package/:id" element={<UpdateTourPackage />} />
        <Route path="/package-report" element={<PackageReportPage />} />
      </Routes>
      <Footer />
    </>
  );
};

export default App;
