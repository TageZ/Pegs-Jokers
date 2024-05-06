import React, {useState, useEffect} from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from './pages/Home'
import Profile from './pages/Profile';
import Game from './pages/Game';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Landing from './pages/Landing';
import Reset from './pages/Reset';
import Waiting from './pages/Waiting';

function App() {
  
  return (
    <BrowserRouter data-testid="browser-router">
      <Routes>
        <Route index element={<Landing />} />
          <Route path="/home" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/waiting" element={<Waiting />} />
          <Route path="/:code/game/0" element={<Game user={0}/>} />
          <Route path="/:code/game/1" element={<Game user={1}/>} />
          <Route path="/:code/game/2" element={<Game user={2}/>} />
          <Route path="/:code/game/3" element={<Game user={3}/>} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/reset" element={<Reset />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
