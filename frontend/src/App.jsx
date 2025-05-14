import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Home';
import Contact from './contact';
import Login from './login';
import Register from './signup';
import Flights from './Flights';
import Airlines from "./Airlines";
import Reservation from "./Reservation";
import ResetPassword from "./ResetPassword";
import Recu from "./recu";
import Paiement from "./paiement";
import AirlineDetails from './AirlineDetails.jsx';
import FichePassagers from './FichePassagers';
import TailwindDemo from './components/TailwindDemo';
import ButtonTest from './ButtonTest';
import './app.css'; 

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/Home" element={<Home />} />
        <Route path="/flights" element={<Flights />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/reservation" element={<Reservation />} />
        <Route path="/Airlines" element={<Airlines />} />
        <Route path="/resetpassword" element={<ResetPassword />} />
        <Route path="/recu" element={<Recu />} />
        <Route path="/paiement" element={<Paiement />} />
        <Route path="/airlines/:id" element={<AirlineDetails />} />
        <Route path="/fiche-passagers" element={<FichePassagers />} />
        <Route path="/tailwind-demo" element={<TailwindDemo />} />
        <Route path="/button-test" element={<ButtonTest />} />
      </Routes>
    </Router>
  );
}

export default App;
