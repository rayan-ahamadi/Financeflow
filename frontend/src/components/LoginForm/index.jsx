import {useState, useContext} from 'react';
import { useNavigate } from 'react-router-dom';
import {Loader} from '../Loader';
import {AuthContext} from '../../context/AuthContext';

function LoginForm() {
  const {login} = useContext(AuthContext);
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [Error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    fetch('/api/utilisateurs/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({email, password}),
    }).then((response) => {
      if (response.ok) {
        return response.json();
      }
      setError('Erreur lors de la connexion');
      return null;
    }).then((data) => {
      console.log(data);
      if (data.error_message) {
        setError(data.error_message);
        return;
      }
      const token = data.token;
      login(token);
      navigate('/');
    }).catch((error) => {
      setError(error.message);
    }).finally(() => {
      setLoading(false);
    });
  }

  return (
    <form action="#" method="POST">
      <div className="form-group">
        <label htmlFor="email">Votre adresse e-mail</label>
        <input type="email" name="email" id="email" placeholder='example@email.com' value={email} onChange={(e) => setEmail(e.target.value)} required/>
      </div>
      <div className="form-group">
        <label htmlFor="password">Votre mot de passe</label>
        <input type="password" name="password" id="password" placeholder='●●●●●●●●' value={password} onChange={(e) => setPassword(e.target.value)} required />
      </div>
      <div className="form-group">
        <button type="submit" value="Connexion" onClick={handleSubmit}>
          {loading ? <Loader/> : 'Connexion'}
        </button>
        <div className="msg">
          { Error && <p style={{color: 'red'}}>{Error}</p> }
        </div>
      </div>
    </form>
  )
}

export { LoginForm };