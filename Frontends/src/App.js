import React from 'react';
import './App.css';
import { Routes, Route } from 'react-router-dom';
import PackagesPage from './Pages/PackagePage';

const App = () => {
  return (
        <Routes>       
          <Route path="/" element={<PackagesPage />} />
          <Route path="/packages" element={<PackagesPage />} />
        </Routes> 
  );
};

export default App;
