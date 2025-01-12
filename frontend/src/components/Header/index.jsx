import React from 'react';
import './Header.css';

const Header = () => {
  return (
    <header className="header">
      <div className="header-container">
        <nav className="header-nav">
          <ul className="header-menu">
            <li className="header-menu-item"><a href="/">Home</a></li>
            <li className="header-menu-item"><a href="/about">About</a></li>
            <li className="header-menu-item"><a href="/contact">Contact</a></li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;