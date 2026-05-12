import React from 'react'
import { Link } from 'react-router';

function Register() {
  const handleRegister = (e) => {
    e.preventDefault();
    console.log("Register form submitted");
  };
  return (
    <main>
      <div className="form-container">
        <h1>Register</h1>
        <form onSubmit={handleRegister}>
          <div className="input-group">
            <label htmlFor="email">Enter Email</label>
            <input type="text" id="email" name="email" placeholder="Enter your email" />
          </div>
          <div className="input-group">
            <label htmlFor="username">Enter Username</label>
            <input type="text" id="username" name="username" placeholder="Enter your username" />
          </div>
          <div className="input-group">
            <label htmlFor="password">Enter Password</label>
            <input type="password" id="password" name="password" placeholder="Enter your password" />
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
  );
}

export default Register