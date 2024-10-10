import React, { useEffect, useState } from 'react';
import {
  Typography,
  Button,
  Container,
  Grid,
  Paper,
} from '@mui/material';

// API configuration
const API_KEY = 'AIzaSyAY1OHYjcnFV5ONKE91PjW_D_J6N4a_7Pc';
const PROJECT_ID = 'bank-84ba3';
const BASE_URL = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents`;

function AdminLoanRequestDashboard() {
  const [loanRequests, setLoanRequests] = useState([]);

  // Function to fetch loan requests from Firestore using REST API
  const fetchLoanRequests = async () => {
    try {
      const response = await fetch(`${BASE_URL}/loanRequests?key=${API_KEY}`);
      const data = await response.json();
      if (data && data.documents) {
        const loanData = data.documents.map((doc) => {
          const id = doc.name.split('/').pop();
          const fields = doc.fields;
          return {
            id,
            name: fields.name.stringValue,
            email: fields.email.stringValue,
            phoneNumber: fields.phoneNumber.stringValue,
            status: fields.status.stringValue,
            initialDeposit: fields.initialDeposit.integerValue,
          };
        });
        setLoanRequests(loanData);
      }
    } catch (error) {
      console.error('Error fetching loan requests:', error);
    }
  };

  // Function to update loan status using Firestore REST API
  const updateLoanStatus = async (id, status) => {
    try {
      const loanRefPath = `${BASE_URL}/loanRequests/${id}?key=${API_KEY}`;
      const requestBody = {
        fields: {
          status: { stringValue: status },
        },
      };
      await fetch(loanRefPath, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });
      fetchLoanRequests(); // Refresh loan requests after status update
    } catch (error) {
      console.error('Error updating loan status:', error);
    }
  };

  useEffect(() => {
    fetchLoanRequests();
  }, []);

  return (
    <Container>
      <Typography variant="h4" align="center" gutterBottom>
        Loan Requests {/* Title for loan requests */}
      </Typography>
      <Grid container spacing={2}>
        {loanRequests.map((loan) => (
          <Grid item xs={12} sm={6} md={4} key={loan.id}>
            <Paper elevation={3} style={{ padding: '16px', borderRadius: '8px' }}>
              <Typography variant="h6">{loan.name}</Typography>
              <Typography>Email: {loan.email}</Typography>
              <Typography>Phone Number: {loan.phoneNumber}</Typography>
              <Typography>
                Status: <span style={{ fontWeight: 'bold', color: loan.status === 'Approved' ? 'green' : loan.status === 'Denied' ? 'red' : 'orange' }}>{loan.status}</span>
              </Typography>
              <Typography>Initial Deposit: {loan.initialDeposit}</Typography>
              <div style={{ marginTop: '16px' }}>
                <Button
                  variant="contained"
                  color="success"
                  onClick={() => updateLoanStatus(loan.id, 'Approved')}
                  style={{ margin: '5px' }}
                >
                  Approve
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  onClick={() => updateLoanStatus(loan.id, 'Denied')}
                  style={{ margin: '5px' }}
                >
                  Deny
                </Button>
                <Button
                  variant="contained"
                  color="warning"
                  onClick={() => updateLoanStatus(loan.id, 'On Hold')}
                  style={{ margin: '5px' }}
                >
                  Hold
                </Button>
              </div>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

export default AdminLoanRequestDashboard;
