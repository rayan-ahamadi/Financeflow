import { BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import { useContext, useEffect } from 'react'
import './styles/App.css'

import Error from './pages/Error/index.jsx'
import Home from './pages/Home/index.jsx'
import Login from './pages/Login/index.jsx'
import Register from './pages/Register/index.jsx'
import Launcher from './pages/Launcher/index.jsx'
import PrivateRoute from './components/PrivateRoute/index.jsx'
import { AuthContext } from './context/AuthContext.jsx'


function App(){
  // Contexte d'authentification de l'utilisateur
  const { logout, isTokenExpired, user } = useContext(AuthContext);
  const token = localStorage.getItem('token');
  const isTokenEx = isTokenExpired(token) 

  // Vérifier le token si il y en a un
  useEffect(() => {
    if (token && user && isTokenEx) {
      alert('Votre session a expiré. Veuillez vous reconnecter.');
      logout(); 
      return;
    }

  }, [isTokenEx, logout,token,user]);



  // Définition des routes de l'application
  return (
    <Router>
        <Routes>
          {/*Routes publiques*/}
          <Route path="/welcome" element={<Launcher />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          {/*Routes privées*/}
          <Route path="/" element={<PrivateRoute><Home /></PrivateRoute>} />
          {/*Routes non existantes*/}
          <Route path="*" element={<Error />} />
        </Routes>

    </Router>
  );

}

export default App;