import React from 'react';
import { Button, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';

function CustomerDashboard() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/');
    } catch (error) {
      console.error('Error signing out: ', error);
    }
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <Typography variant="h4">Customer Dashboard</Typography>
      <Button
        variant="contained"
        color="secondary"
        onClick={handleLogout}
        style={{ marginTop: '20px' }}
      >
        Logout
      </Button>
    </div>
  );
}

export default CustomerDashboard;
