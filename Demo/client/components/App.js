import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Demo from './Demo.js';
import Homepage from './Homepage.js';
import About from './About.js';
import LandingPage from './LandingPage.js';
import Team from './Team.js';






const App = () => {
  // const logo = document.querySelectorAll('#logo path');
  // console.log(logo);
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element ={<LandingPage />}></Route>
        <Route path='/homepage' element = {<Homepage />}></Route>
        <Route path='/demo' element = {<Demo />}></Route>
        <Route path='/about' element = {<Team />}></Route>
      </Routes>
    </BrowserRouter>   
  );
  
};


export default App; 