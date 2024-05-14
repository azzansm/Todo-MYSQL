import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { signUp, updateUserProfile } from './AuthService';
import styles from '../styles/modules/signup.module.scss';

const SignUpPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [reenterPassword, setReenterPassword] = useState('');

  const handleSignUp = async (event) => {
    event.preventDefault();
    if (password !== reenterPassword) {
      toast.error('Passwords do not match');
      return;
    }
    try {
      const userCredential = await signUp(email, password);
      await updateUserProfile(userCredential.user, { displayName: fullName });
      navigate('/login');
      toast.success('Sign up successful! Please log in.');
    } catch (error) {
      console.error('Failed to sign up:', error.code, error.message);
      toast.error('Failed to sign up.');
    }
  };

  return (
    <div className={styles.authBackground}>
      <form onSubmit={handleSignUp} className={styles.authForm}>
        <input
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="Full Name"
          className={styles.inputField}
          required
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className={styles.inputField}
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className={styles.inputField}
          required
        />
        <input
          type="password"
          value={reenterPassword}
          onChange={(e) => setReenterPassword(e.target.value)}
          placeholder="Re-enter Password"
          className={styles.inputField}
          required
        />
        <button type="submit" className={styles.authButton}>
          Sign Up
        </button>
        <p className={styles.signUpLink}>
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </form>
    </div>
  );
};

export default SignUpPage;
