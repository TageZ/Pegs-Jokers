import React from 'react';
import "../Styling.css";
import homeIcon from "../images/home-icon.svg";

const NavBar = ({ title }) => {
    return (
      <nav className="navBar">
        <button data-testid="navbar-button" className="navButton" onClick={() => window.location.href = '/home'}>
            <img src={homeIcon} />
        </button>
        <h1 className="navTitle">{title}</h1>
      </nav>
    );
  };

export default NavBar;