import { createContext, useState } from "react";
import PropTypes from 'prop-types';

const AuthContext = createContext();

const AuthProvider = ({children}) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    
    const login = (user,token) => {
        setUser(user);
        localStorage.setItem('token', token);
        setLoading(false);
    }
    
    const logout = () => {
        setUser(null);
        localStorage.removeItem('token');
        setLoading(false);
    }
    
    return (
        <AuthContext.Provider value={{user, login, logout, loading}}>
            {children}
        </AuthContext.Provider>
    )
}

AuthProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

export { AuthContext, AuthProvider };
