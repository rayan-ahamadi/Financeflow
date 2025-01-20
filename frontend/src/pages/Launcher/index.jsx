import {React} from 'react';
import {Link} from 'react-router-dom';
import '../../styles/Welcome.css'


function Launcher() {
    return (
        <div className='welcome-container'>
            <div className="welcome-background"></div>
            <div className="content-container">
                <div className="content">
                    <h1>Finance-Flow</h1>
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