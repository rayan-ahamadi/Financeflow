import { Loader } from '../Loader'
import { AuthContext } from '../../context/AuthContext'
import { useContext, useState } from 'react'
import { redirect } from 'react-router-dom'


function SignupForm(){
  const {login} = useContext(AuthContext);
  const [Loading, setLoading] = useState(false);
  const [Error, setError] = useState('');
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role] = useState('user');

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    fetch('http://localhost:8000/api/utilisateurs/signup', {
      mode: 'no-cors',
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: JSON.stringify({name, surname, email, password, confirmPassword,role}),
    }).then((response) => {
      if (response.ok) {
        return response.json();
      }
      throw new Error('Erreur lors de l\'inscription');
    }).then((data) => {
      if (data.error_message) {
        throw new Error(data.error_message);
      }
      login(data.user_id, data.token);
      redirect('/');
    }).catch((error) => {
      setError(error.message);
    }).finally(() => {
      setLoading(false);
    });
  }


  return (
    <form action='#' method="POST">
      <div className="form-group">
        <label htmlFor="nom">Nom</label>
        <input type="text" name="surname" id="nom" placeholder='Doe' value={name} onChange={(e) => setName(e.target.value)}/>
      </div>
      <div className="form-group">
        <label htmlFor="prénom">Prénom</label>
        <input type="text" name='name' id='prenom' placeholder='Joe' value={surname} onChange={(e) => setSurname(e.target.value)}/>
      </div>
      <div className="form-group">
        <label htmlFor="email">E-mail</label>
        <input type="email" name="email" id="email" placeholder='example@email.com' value={email} onChange={(e) => setEmail(e.target.value)}/>
      </div>
      <div className="form-group">
        <label htmlFor="password">Mot de passe</label>
        <input type="password" name="password" id="password" placeholder='●●●●●●●●' value={password} onChange={(e) => setPassword(e.target.value)}/>
      </div>
      <div className="form-group">
        <label htmlFor="confirm-password">Confirmer le mot de passe</label>
        <input type="password" name='confirm-password' id='confirm-password' placeholder='●●●●●●●●' value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}/>
      </div>
      <div className="form-group">
        <button type="submit" value="Inscription" onClick={handleSubmit}>
          {Loading ? <Loader/> : 'Inscription'}
        </button>
      </div>
      <div className="msg">
        {Error && <p>{Error}</p>}
      </div>
    </form>
  )
}

export {SignupForm}