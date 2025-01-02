import {useState} from 'react';
import { redirect } from 'react-router-dom';
import {Loader} from '../Loader';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false); 

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch('http://localhost:8000/api/utilisateurs/login', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({email, password}),
    }).then((response) => {
      if (response.ok) {
        return response.json();
      }
      throw new Error('Email ou mot de passe incorrect');
    }).then((data) => {
      localStorage.setItem('token', data.token);
      redirect('/');
    }).catch((error) => {
      console.error(error);
    }).finally(() => {
      setLoading(false);
    });
  }

  return (
    <form action="" method="POST">
      <div className="form-group">
        <label htmlFor="email">Votre adresse e-mail</label>
        <input type="email" name="email" id="email" placeholder='example@email.com' value={email} onChange={(e) => setEmail(e.target.value)}/>
      </div>
      <div className="form-group">
        <label htmlFor="password">Votre mot de passe</label>
        <input type="password" name="password" id="password" placeholder='●●●●●●●●' value={password} onChange={(e) => setPassword(e.target.value)} />
      </div>
      <div className="form-group">
        <button type="submit" value="Connexion" onSubmit={handleSubmit}>
          {loading ? <Loader/> : 'Connexion'}
        </button>
      </div>
    </form>
  )
}

export { LoginForm };