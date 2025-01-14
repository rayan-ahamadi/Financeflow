import { UserContext } from '../../context/UserContext';
import { useContext } from 'react';
import { Loader } from '../../components/Loader';
import { Header } from '../../components/Header';
import { Balance } from '../../components/Balance';
import { TransactionContainer } from '../../components/TransactionContainer';
import '../../styles/Home.css';

function Home() {
  const { userData, userloading } = useContext(UserContext);

  if (userloading) {
    return <div style={{height : "100vh", display : "flex", flexDirection : "column", justifyContent : "center" , alignItems : "center", fontSize: "60px"}} >
      <p>Chargement de vos données...</p>
      <Loader />
      </div>;
  }


  return (
    <div className="app-container">
      <Header />
      <div className="home-container">
        <h1>Salut, {userData?.name}!</h1>
        <Balance />
        <TransactionContainer limit={5} />
      </div>
    </div>
  );
}

export default Home;
