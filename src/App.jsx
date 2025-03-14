import React from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Login from './Pages/Login';
import AllParticipant from './Pages/AllParticipant';
import User from './Components/User';
import Events from './Pages/Events';
import SaPage from './Pages/SaPage';
import Halls from './Pages/Halls';
import Accomodation from './Pages/Accomodation';
// import Events from './Pages/Events';

const  App = () => {
  return (
    <>
<Router>
      <Routes>
        {/* <Route path="/" element={<AdminPage />} /> */}
        <Route path="/" element={<Login />} />
        <Route path="/allUsers" element={<AllParticipant />} />
        <Route path="/user/:id" element={<User />} />
        <Route path="/allevents" element={<Events />} />
        <Route path="/allSa" element={<SaPage />} />
        <Route path="/Halls" element={<Halls/>}/>
        <Route path="/Acco" element={<Accomodation/>}/>
        
      </Routes>
    </Router>    </>
  )
}

export default App
