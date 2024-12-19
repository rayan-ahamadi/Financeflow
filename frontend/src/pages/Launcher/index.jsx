import {React} from 'react';
import {Link} from 'react-router-dom';
import './Launcher.css'


function Launcher() {
    return (
        <div className="launcher-container">
            <img src="./assets/image/logo" alt="logo Finance-Flow" />
            <h1>Finance-Flow</h1>
            <p>Gérer votre budget n'a jamais été aussi simple.</p>
            <button>
                <Link to="/login">Connexion</Link>
            </button>
            <button>
              <Link to="/register">Inscription</Link>
            </button>
            <Link to="/forgot-password">Mot de passe oublié ?</Link>
        </div>
    );
}

export default Launcher;