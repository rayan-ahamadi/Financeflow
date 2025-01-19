import '../../styles/Header.css';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse, faArrowRightArrowLeft } from '@fortawesome/free-solid-svg-icons';


const Header = () => {
  return (
    <header className="header">
      <div className="header-container">
        <nav className="header-nav">
          <Link to="/">
            <span className="header-menu-item" aria-label="Accueil">
              <FontAwesomeIcon icon={faHouse} />
            </span>
          </Link>
          <Link to="/transactions">
            <span className="header-menu-item" aria-label="Transactions">
              <FontAwesomeIcon icon={faArrowRightArrowLeft} />
            </span>
          </Link>
        </nav>
      </div>
    </header>
  );
};

export {Header};