import { AuthContext } from '../../context/AuthContext';
import { UserContext } from '../../context/UserContext';
import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader } from '../../components/Loader';

function Home() {
  const navigate = useNavigate();
  const { logout, isTokenExpired } = useContext(AuthContext);
  const { userData } = useContext(UserContext);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    
    if (!token || isTokenExpired(token) || !userData) {
      alert('Votre session a expiré. Veuillez vous reconnecter.');
      logout(); 
      navigate('/login');
      setLoading(false);
      return;
    }

    if (userData){
      setLoading(false);
    }

  }, [isTokenExpired, logout, navigate, userData]);

  if (loading) {
    return <>
     <Loader />
    </>
  }

  return (
    <div>
      <h1>Salut, {userData?.name}!</h1>
    </div>
  );
}

export default Home;
