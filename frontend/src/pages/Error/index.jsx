import {react} from 'react';
import {Link} from 'react-router-dom';

function Error() {
    return (
        <div className='error-container'>
            <h1>Erreur 404</h1>
            <p>La page que vous recherchez n'existe pas.</p>
            <Link to="/">Retour à l'accueil</Link>
        </div>
    );
}

export default Error;