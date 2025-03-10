import { createContext, useEffect, useState } from "react";
import {jwtDecode} from 'jwt-decode';
import {PropTypes} from 'prop-types';


const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    // Stocke l'identifiant de l'utilisateur connecté
    const [user, setUser] = useState(null);

     const isTokenExpired = () => {
         const token = localStorage.getItem('token');
         if (!token) return "Token non trouvé";
         try {
             const decodedToken = jwtDecode(token);
             const now = Date.now() / 1000;  // Timestamp actuel en secondes
             return decodedToken.exp < now;
         } catch (error) {
             console.error('Error decoding token:', error);
             return true;  // Considérer le token comme expiré s'il est invalide
         }
     };

    const login = () => {
        const token = localStorage.getItem('token');
        if (isTokenExpired(token)) {
            console.error('Token expiré, veuillez vous reconnecter.');
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
        window.location.reload();
    };

    useEffect(() => {
        const token = localStorage.getItem("token")
        if (token && !user){
            const decodedToken = jwtDecode(localStorage.getItem('token'));
            setUser(decodedToken.id_user);
        }
    }, [user]);

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
