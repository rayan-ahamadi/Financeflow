import './Home.css'
import {AuthContext} from '../../context/AuthContext';
import {useContext, useEffect} from 'react';
import {jwtDecode} from 'jwt-decode';


function Home() {
  const token = localStorage.getItem('token');
  const tokenDecoded = jwtDecode(token);
  const user = tokenDecoded.id_user;
  
  return (
    <>
      <h1>Bienvenue. {user} {token}</h1>
    </>
  )
}

export default Home
