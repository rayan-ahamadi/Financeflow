import {React} from 'react';
import {Link} from 'react-router-dom';
import '../../styles/Welcome.css'
import logo from '../../assets/image/logo.png'


function Launcher() {
    return (
        <div className='welcome-container'>
            <div className="welcome-background"></div>
            <div className="content-container">
                <div className="content">
                    <div className='launcher-logo' >
                        <img src={logo} alt="logo Finance-Flow" />
                    </div>
                    <h1>Finance-Flow</h1>
                    <p>Gérer votre budget n'a jamais été aussi simple.</p>
                    <div className="laucher-buttons">
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
        </div>
    );
}

export default Launcher;