import React, { useState } from 'react'
import { Link } from 'react-router';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router';
import Guest from '../components/Guest';
function Register() {

  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const { handleRegister, loading, errorMessage, success } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const isSuccess = await handleRegister({ email, username, password });
    if (isSuccess) {
      navigate('/');
    }
  };

  if (loading) {
    return (
      <main>
        <h2 className="text-center">Loading...</h2>
      </main>
    )
  }

  return (
    <Guest>
      <main>
        <div className="form-container">
          <h1>Register</h1>
          <form onSubmit={handleSubmit}>
            {errorMessage && <p className="text-error">{errorMessage}</p>}
            <div className="input-group">
              <label htmlFor="email">Enter Email</label>
              <input type="text" id="email" value={email} onChange={(e) => setEmail(e.target.value)} name="email" placeholder="Enter your email" />
            </div>
            <div className="input-group">
              <label htmlFor="username">Enter Username</label>
              <input type="text" id="username" value={username} onChange={(e) => setUsername(e.target.value)} name="username" placeholder="Enter your username" />
            </div>
            <div className="input-group">
              <label htmlFor="password">Enter Password</label>
              <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} name="password" placeholder="Enter your password" />
            </div>
            <button className="btn primary-btn w-full" type="submit">
              Register
            </button>
            <p className="mt-4">
              Already have an account? <Link to="/login" className="primary-link link-underline">Login</Link>
            </p>
          </form>
        </div>
      </main>
    </Guest>
  );
}

export default Register