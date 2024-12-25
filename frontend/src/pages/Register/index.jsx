import { react } from 'react';
import { Link } from 'react-router-dom';
import '../../styles/Welcome.css'

function Register () {
  return ( 
    <div className="welcome-container">
      <div className='content-container'>
        <div className="content">
          <h2>Inscrivez-vous</h2>
          <form action="" method="POST">
              <div className="form-group">
                <label htmlFor="nom">Nom</label>
                <input type="text" name="surname" id="nom" placeholder='Doe'/>
              </div>
              <div className="form-group">
                <label htmlFor="prénom">Prénom</label>
                <input type="text" name='name' id='prenom' placeholder='Joe'/>
              </div>
              <div className="form-group">
                <label htmlFor="email">E-mail</label>
                <input type="email" name="email" id="email" placeholder='example@email.com'/>
              </div>
              <div className="form-group">
                <label htmlFor="password">Mot de passe</label>
                <input type="password" name="password" id="password" placeholder='●●●●●●●●'/>
              </div>
              <div className="form-group">
                <label htmlFor="confirm-password">Confirmer le mot de passe</label>
                <input type="text" name='confirm-password' id='confirm-password' placeholder='●●●●●●●●'/>
              </div>
              <input type="hidden" name='role' value="user"/>
              <div className="form-group">
                <input type="submit" value="Inscription" />
              </div>
          </form>
          <div className="separator">

          </div>

          <p>Déjà un compte ? <Link to="/login">Connectez-vous.</Link></p>
        </div>
        
      </div>
    </div>
  );
}

export default Register;