import {React} from 'react';
import {Link} from 'react-router-dom';
import '../../styles/Welcome.css'


function Launcher() {
    return (
        <div className='welcome-container'>
            <div className="content-container">
                <div className="content">
                    <img src="./assets/image/logo" alt="logo Finance-Flow" />
                    <h1>Finance-Flow</h1>
                    <p>Gérer votre budget n'a jamais été aussi simple.</p>
                    <button className='connexion'>
                        <Link to="/login">Connexion</Link>
                    </button>
                    <button className='register'>
                        <Link to="/register">Inscription</Link>
                    </button>
                    <Link to="/forgot-password">Mot de passe oublié ?</Link>
                </div>         
            </div>
        </div>
    );
}

export default Launcher;