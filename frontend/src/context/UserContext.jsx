import {createContext, useState,useContext,useEffect} from 'react';
import PropTypes from 'prop-types';
import { AuthContext } from './AuthContext';
import { useNavigate } from 'react-router-dom';

const UserContext = createContext();

const UserProvider = ({children}) => {
    // Récuperer identifiant de l'utilisateur connecté
    const {user} = useContext(AuthContext);
    const [userData, setUserData] = useState(null);
    
    useEffect(() => {
        if (!user || userData) {
            return;
        }

        fetch(`/api/utilisateurs/${user}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json',
            },
        })
        .then((response) => {
            if (!response.ok) {
                alert('Une erreur est survenue lors de la récupération des données.');
            }
            return response.json();
        })
        .then((data) => {
            setUserData(data);
        })
        .catch((err) => {
            alert(err.message);
        });
    }, [user,userData]);

    return (
        <UserContext.Provider value={{userData, setUserData}}>
            {children}
        </UserContext.Provider>
    );
};
UserProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

export {UserContext, UserProvider};
