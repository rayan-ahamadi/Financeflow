import { AuthContext } from '../../context/AuthContext';
import { UserContext } from '../../context/UserContext';
import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader } from '../../components/Loader';

function Home() {
  const navigate = useNavigate();
  const { userData } = useContext(UserContext);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    
    if (userData){
      setLoading(false);
    }

  }, [userData]);

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
