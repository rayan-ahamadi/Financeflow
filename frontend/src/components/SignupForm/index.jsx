import { Loader } from '../Loader'
import { AuthContext } from '../../context/AuthContext'
import { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'


function SignupForm(){
  const navigate = useNavigate();
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

    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas.');
      return;
    }

    setLoading(true);

    fetch('/api/utilisateurs/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({name, surname, email, password, confirmPassword,role}),
    }).then((response) => {
      if (response.ok) {
        return response.json();
      }
      setError('Erreur lors de l\'inscription');
    }).then((data) => {
      if (data.error_message) {
        setError(data.error_message);
        return;
      }
      const token = JSON.parse(data.token);
      console.log(token.token);
      login(token.token);
      navigate('/');
    }).catch((error) => {
      setError(error.message);
    }).finally(() => {
      setLoading(false);
    });
  }


  return (
    <form action='' method="POST" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="prénom">Prénom</label>
        <input type="text" name='name' id='prenom' placeholder='Joe' value={surname} onChange={(e) => setName(e.target.value)} pattern="[A-Za-zÀ-ÖØ-öø-ÿ]+" required  />
      </div>
      <div className="form-group">
        <label htmlFor="nom">Nom</label>
        <input type="text" name="surname" id="nom" placeholder='Doe' value={name} onChange={(e) => setSurname(e.target.value)} pattern="[A-Za-zÀ-ÖØ-öø-ÿ]+" required  />
      </div>
      <div className="form-group">
        <label htmlFor="email">E-mail</label>
        <input type="email" name="email" id="email" placeholder='example@email.com' value={email} onChange={(e) => setEmail(e.target.value)} required />
      </div>
      <div className="form-group">
        <label htmlFor="password">Mot de passe</label>
        <input type="password" name="password" id="password" placeholder='●●●●●●●●' value={password} onChange={(e) => setPassword(e.target.value)} pattern="(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}" title="Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial." required />
      </div>
      <div className="form-group">
        <label htmlFor="confirm-password">Confirmer le mot de passe</label>
        <input type="password" name='confirm-password' id='confirm-password' placeholder='●●●●●●●●' value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} pattern="(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}" title="Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial."  required />
      </div>
      <div className="form-group">
        <button type="submit" value="Inscription">
          {Loading ? <Loader/> : 'Inscription'}
        </button>
      </div>
      <div className="msg">
        { Error && <p style={{color: 'red'}}>{Error}</p> }
      </div>
    </form>
  )
}

export {SignupForm}