import React, { useState } from 'react';
import { Button, TextField, Typography, Paper } from '@mui/material';
import { auth, db } from '../firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { setDoc, doc, getDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

function LoginSignup() {
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    // Admin login credentials
    const adminEmail = 'soundarya@gmail.com';
    const adminPassword = 'Lakchida@123';

    if (email === adminEmail && password === adminPassword) {
      // Admin Login
      navigate('/admin');
    } else if (isSignup) {
      // New Customer Signup Process
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Store user role in Firestore as 'newCustomer'
        await setDoc(doc(db, 'users', user.uid), { email, role: 'newCustomer' });

        // Redirect to new customer dashboard
        navigate('/customer/existing');
      } catch (err) {
        setError(err.message);
      }
    } else {
      // Existing Customer Login Process
      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Get user role from Firestore
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          if (userData.role === 'newCustomer') {
            // Redirect to new customer dashboard
            navigate('/customer/existing');
          } else if (userData.role === 'existingCustomer') {
            // Redirect to existing customer dashboard
            navigate('/customer/existing');
          } else {
            setError('Invalid user role');
          }
        } else {
          setError('No such user found in the database');
        }
      } catch (err) {
        setError(err.message);
      }
    }
  };

  return (
    <Paper elevation={3} style={{ padding: '20px', marginTop: '20px' }}>
      <Typography variant="h5">{isSignup ? 'Customer Signup' : 'Login'}</Typography>
      {error && <Typography color="error">{error}</Typography>}
      <form onSubmit={handleSubmit}>
        <TextField
          margin="normal"
          required
          fullWidth
          label="Email"
          variant="outlined"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          label="Password"
          type="password"
          variant="outlined"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button type="submit" fullWidth variant="contained" color="primary" style={{ marginTop: '20px' }}>
          {isSignup ? 'Signup' : 'Login'}
        </Button>
      </form>
      {!isSignup && (
        <Button
          fullWidth
          variant="text"
          color="primary"
          onClick={() => setIsSignup(!isSignup)}
          style={{ marginTop: '20px' }}
        >
          Don't have an account? Signup as Customer
        </Button>
      )}
    </Paper>
  );
}

export default LoginSignup;
