import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import './Main.css'

import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'

import PrivateRoute from './components/PrivateRoute'



createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router>
      <Routes>
        {/*Routes publiques*/}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        {/*Routes privées*/}
        <Route path="/" element={<PrivateRoute><Home /></PrivateRoute>} />

      </Routes>
    </Router>
  </StrictMode>,
)
