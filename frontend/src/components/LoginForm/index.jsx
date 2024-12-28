function LoginForm(){

  return (
    <form action="" method="POST">
      <div className="form-group">
        <label htmlFor="email">Votre adresse e-mail</label>
        <input type="email" name="email" id="email" placeholder='example@email.com'/>
      </div>
      <div className="form-group">
        <label htmlFor="password">Votre mot de passe</label>
        <input type="password" name="password" id="password" placeholder='●●●●●●●●' />
      </div>
      <div className="form-group">
        <input type="submit" value="Connexion" />
      </div>
    </form>
  )
}

export default LoginForm;