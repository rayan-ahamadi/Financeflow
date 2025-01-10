import { createContext, useState } from "react";
import {jwtDecode} from 'jwt-decode';
import {PropTypes} from 'prop-types';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    // Stocke l'identifiant de l'utilisateur connecté
    const [user, setUser] = useState(null);

    const isTokenExpired = (token) => {
        try {
            const decodedToken = jwtDecode(token);
            const now = Date.now() / 1000; // Timestamp actuel en secondes
            return decodedToken.exp < now;
        } catch (error) {
            console.error('Error decoding token:', error);
            return true; // Considérer le token comme expiré s'il est invalide
        }
    };

    const login = (token) => {
        if (isTokenExpired(token)) {
            console.error('Token expiré, impossible de se connecter.');
            logout();
            return;
        }
        const decodedToken = jwtDecode(token);
        setUser(decodedToken.id_user);
        localStorage.setItem('token', token);
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('token');
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, isTokenExpired }}>
            {children}
        </AuthContext.Provider>
    );
};

AuthProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

export { AuthContext, AuthProvider };
