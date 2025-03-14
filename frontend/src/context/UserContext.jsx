import {createContext, useState,useContext,useEffect} from 'react';
import PropTypes from 'prop-types';
import { AuthContext } from './AuthContext';


const UserContext = createContext();

const UserProvider = ({children}) => {
    // Récuperer identifiant de l'utilisateur connecté
    const {user} = useContext(AuthContext);
    const [userData, setUserData] = useState(null);
    const [userloading, setUserLoading] = useState(true);
    
    const fetchUserData = () => { 
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
            setUserLoading(false);
        })
        .catch((err) => {
            alert(err.message);
        });
    }





    useEffect(() => {
        if (!user || userData) {
            return;
        }
        fetchUserData()
    }, [user,userData]);

    return (
        <UserContext.Provider value={{userData, setUserData,userloading, fetchUserData}}>
            {children}
        </UserContext.Provider>
    );
};
UserProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

export {UserContext, UserProvider};
