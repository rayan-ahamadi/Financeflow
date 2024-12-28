import { react } from 'react';
import { Link } from 'react-router-dom';
import '../../styles/Welcome.css';
import {LoginForm} from '../../components/LoginForm';

function Login () {
  return (
    
    <div className="welcome-container">
      <div className="welcome-background"></div>
      <div className='content-container'>
        <div className="content">
          <h2>CONNEXION</h2>
          <LoginForm/>
          <div className="separator"></div>
          <p>Pas de compte ? <Link to="/register">Inscrivez-vous.</Link></p>
        </div>
        
      </div>
    </div>
  );
}

export default Login;