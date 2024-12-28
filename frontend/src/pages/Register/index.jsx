import { react } from 'react';
import { Link } from 'react-router-dom';
import '../../styles/Welcome.css'
import {SignupForm} from '../../components/SignupForm'

function Register () {
  return ( 
    <div className="welcome-container">
      <div className="welcome-background"></div>
      <div className='content-container'>
        <div className="content">
          <h2>INSCRIPTION</h2>
          <SignupForm/>
          <div className="separator"></div>
          <p>Déjà un compte ? <Link to="/login">Connectez-vous.</Link></p>
        </div> 
      </div>
    </div>
  );
}

export default Register;