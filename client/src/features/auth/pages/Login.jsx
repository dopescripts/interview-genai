import React, { useState } from "react";
import "../auth.form.scss";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../hooks/useAuth";
import PixelTransition from "../components/PixelTransition";

function Login() {

  const {handleLogin, loading} = useAuth();

  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    await handleLogin({email, password});
    navigate('/');
  };

  const loginFormContent = (
    <div className="form-container">
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label htmlFor="email">Enter Email</label>
          <input type="text" id="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" />
        </div>
        <div className="input-group">
          <label htmlFor="password">Enter Password</label>
          <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} name="password" placeholder="Enter your password" />
        </div>
        <button className="btn primary-btn w-full" type="submit">
          Login
        </button>
        <p className="mt-4">
          Don't have an account? <Link to="/register" className="primary-link link-underline">Register</Link>
        </p>
      </form>
    </div>
  );

  const loadingContent = (
    <div style={{
      width: '100%',
      height: '100%',
      display: 'grid',
      placeItems: 'center',
      backgroundColor: '#111'
    }}>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '1rem'
      }}>
        <div style={{
          width: '40px',
          height: '40px',
          border: '4px solid #f20089e4',
          borderTop: '4px solid transparent',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }} />
        <p style={{ fontSize: '1rem', color: '#ffffff', fontWeight: '500' }}>Logging in...</p>
      </div>
    </div>
  );

  return (
    <main style={{ position: 'relative' }}>
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
      <PixelTransition
        firstContent={loginFormContent}
        secondContent={loadingContent}
        gridSize={12}
        pixelColor='#f20089e4'
        animationStepDuration={0.4}
        trigger={loading}
        disableHover={true}
        style={{
          width: '350px',
          height: 'auto',
          aspectRatio: 'auto',
          padding: '2rem',
          border: '0px solid #f20089e4',
          backgroundColor: 'transparent'
        }}
        className="login-pixel-transition"
      />
    </main>
  );
}

export default Login;
