import { createContext, useState } from "react";
import {jwtDecode} from 'jwt-decode';
import {PropTypes} from 'prop-types';

const AuthContext = createContext();

const AuthProvider = ({children}) => {
    const [user, setUser] = useState(null);
    
    const login = (token) => {
        const decodedToken = jwtDecode(token);
        setUser(decodedToken.id_user);
        localStorage.setItem('token', token);
    }
    
    const logout = () => {
        setUser(null);
        localStorage.removeItem('token');
    }
    
    return (
        <AuthContext.Provider value={{user, login, logout}}>
            {children}
        </AuthContext.Provider>
    )
}

AuthProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

export { AuthContext, AuthProvider };
