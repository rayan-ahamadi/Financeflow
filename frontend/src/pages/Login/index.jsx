import { react } from 'react';
import { Link } from 'react-router-dom';
import '../../styles/Welcome.css'

function Login () {
  return (
    
    <div className="welcome-container">
      <div className='content-container'>
        <div className="content">
          <h2>Connexion</h2>
          <form action="" method="POST">
              <div className="form-group">
                <label htmlFor="email">Votre adresse e-mail</label>
                <input type="email" name="email" id="email" placeholder='example@email.com'/>
              </div>
              <div className="form-group">
                <label htmlFor="password">Votre mot de passe</label>
                <input type="password" name="password" id="password" placeholder='●●●●●●●●' />
              </div>
              <div className="form-group">
                <input type="submit" value="Connexion" />
              </div>
          </form>
          <div className="separator"></div>
          <p>Pas de compte ? <Link to="/register">Inscrivez-vous.</Link></p>
        </div>
        
      </div>
    </div>
  );
}

export default Login;