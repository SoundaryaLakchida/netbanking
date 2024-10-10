// TransferFunds.js
import React, { useState } from 'react';
import { Container, Typography, TextField, Button } from '@mui/material';
import axios from 'axios';

function TransferFunds() {
  const [fromAccount, setFromAccount] = useState('');
  const [toAccount, setToAccount] = useState('');
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');

  const handleTransfer = async () => {
    try {
      if (parseFloat(amount) <= 0) {
        setMessage('Amount should be greater than zero.');
        return;
      }

      // Simulate the logic for fetching accounts and updating balances
      const fromAccountBalance = 5000; // Mock balance for the source account
      if (fromAccountBalance < parseFloat(amount)) {
        setMessage('Insufficient balance in the source account.');
        return;
      }

      // Update both accounts (send money)
      const updatedFromBalance = fromAccountBalance - parseFloat(amount);
      const toAccountBalance = 2000 + parseFloat(amount); // Mock destination balance + amount

      // Mock API calls (replace with your backend logic)
      // await axios.patch(`your-api/accounts/${fromAccount}`, { balance: updatedFromBalance });
      // await axios.patch(`your-api/accounts/${toAccount}`, { balance: toAccountBalance });

      setMessage(`Successfully transferred $${amount} from Account ${fromAccount} to Account ${toAccount}.`);
    } catch (err) {
      console.error('Transfer Error:', err);
      setMessage('Error transferring funds.');
    }
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" align="center" gutterBottom>
        Transfer Funds
      </Typography>
      <TextField
        label="From Account Number"
        value={fromAccount}
        onChange={(e) => setFromAccount(e.target.value)}
        fullWidth
        margin="normal"
      />
      <TextField
        label="To Account Number"
        value={toAccount}
        onChange={(e) => setToAccount(e.target.value)}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Amount"
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        fullWidth
        margin="normal"
      />
      <Button variant="contained" color="primary" fullWidth onClick={handleTransfer}>
        Transfer
      </Button>
      {message && <Typography color="secondary" align="center" style={{ marginTop: '20px' }}>{message}</Typography>}
    </Container>
  );
}

export default TransferFunds;
