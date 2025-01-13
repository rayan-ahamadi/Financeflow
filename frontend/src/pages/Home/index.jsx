import { UserContext } from '../../context/UserContext';
import { useContext, useEffect, useState } from 'react';
import { Loader } from '../../components/Loader';
import { Header } from '../../components/Header';
import '../../styles/Home.css';

function Home() {
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
    <div className="app-container">
      <Header />
      <div className="home-container">
        <h1>Salut, {userData?.name}!</h1>
      </div>
    </div>
  );
}

export default Home;
