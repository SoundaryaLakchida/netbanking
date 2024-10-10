import React, { useState, useEffect } from 'react';
import { Button, Typography, Container, Paper, Tabs, Tab, Box } from '@mui/material';
import axios from 'axios';

const API_KEY = 'AIzaSyAY1OHYjcnFV5ONKE91PjW_D_J6N4a_7Pc';
const PROJECT_ID = 'bank-84ba3';
const BASE_URL = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents`;

function AdminDashboard() {
  const [accountRequests, setAccountRequests] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingAccounts, setLoadingAccounts] = useState(true);
  const [selectedTab, setSelectedTab] = useState(0);

  useEffect(() => {
    fetchAccountRequests();
    fetchApprovedAccounts();
  }, []);

  const fetchAccountRequests = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/accountRequests?key=${API_KEY}`);
      const documents = response.data.documents || [];
      const requests = documents.map((doc) => ({
        id: doc.name.split('/').pop(),
        data: doc.fields,
      }));
      setAccountRequests(requests);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching account requests:', error);
      setLoading(false);
      alert('Failed to load account requests. Please try again later.');
    }
  };

  const fetchApprovedAccounts = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/accounts?key=${API_KEY}`);
      const documents = response.data.documents || [];
      const approvedAccounts = documents.map((doc) => ({
        id: doc.name.split('/').pop(),
        data: doc.fields,
      }));
      setAccounts(approvedAccounts);
      setLoadingAccounts(false);
    } catch (error) {
      console.error('Error fetching approved accounts:', error);
      setLoadingAccounts(false);
      alert('Failed to load approved accounts. Please try again later.');
    }
  };

  const updateRequestStatus = async (id, status) => {
    try {
      const payload = {
        fields: {
          ...accountRequests.find((req) => req.id === id).data,
          status: { stringValue: status },
        },
      };

      await axios.patch(`${BASE_URL}/accountRequests/${id}?key=${API_KEY}`, payload);

      // If the status is approved, initialize account details
      if (status === 'approved') {
        await initializeAccount(id); // Initialize account
      }

      alert(`Account request ${status.toLowerCase()} successfully`);
      fetchAccountRequests(); // Refresh account requests data
      fetchApprovedAccounts(); // Refresh the approved accounts to update the UI
    } catch (error) {
      console.error('Error updating request status:', error);
      alert('Failed to update request status. Please try again.');
    }
  };

  const initializeAccount = async (requestId) => {
    try {
      const request = accountRequests.find((req) => req.id === requestId);
      const accountNumber = `ACC${Math.floor(Math.random() * 1000000)}`; // Generate a random account number
      const ifscCode = `IFSC${Math.floor(Math.random() * 10000)}`; // Generate a random IFSC code
      const initialDeposit = getFieldValue(request.data.initialDeposit) || 0;

      // Check if the account already exists
      const existingAccount = accounts.find((acc) => acc.data.email?.stringValue === request.data.email?.stringValue);
      if (existingAccount) {
        alert('This account has already been approved.');
        return;
      }

      // Prepare account payload
      const accountPayload = {
        fields: {
          firstName: request.data.firstName,
          lastName: request.data.lastName,
          email: request.data.email,
          accountNumber: { stringValue: accountNumber },
          ifscCode: { stringValue: ifscCode },
          initialDeposit: { integerValue: initialDeposit }, // Store initial deposit
          bankBalance: { integerValue: initialDeposit }, // Set bank balance equal to initial deposit
        },
      };

      // Store the account in the Firestore accounts collection
      await axios.post(`${BASE_URL}/accounts?key=${API_KEY}`, accountPayload);
      alert('Account initialized successfully.');
    } catch (error) {
      console.error('Error initializing account:', error);
      alert('Failed to initialize account. Please try again.');
    }
  };

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const handleSignOut = () => {
    alert('Signing out...');
    // Replace with your sign-out logic here
  };

  const getFieldValue = (field) => {
    if (!field) return 'N/A';
    if (field.stringValue !== undefined) return field.stringValue;
    if (field.integerValue !== undefined) return field.integerValue.toString();
    return 'N/A';
  };

  return (
    <Container>
      <Box display="flex" justifyContent="space-between" alignItems="center" my={2}>
        <Typography variant="h4">Admin Dashboard</Typography>
        <Button variant="contained" color="secondary" onClick={handleSignOut}>
          Sign Out
        </Button>
      </Box>
      <Tabs value={selectedTab} onChange={handleTabChange} centered>
        <Tab label="Account Requests" />
        <Tab label="Loan Requests" />
        <Tab label="Customer Account Details" />
        <Tab label="Customer Transactions" />
        <Tab label="Set Transaction Limit" />
      </Tabs>

      {/* Account Requests Section */}
      {selectedTab === 0 && (
        <div>
          <Typography variant="h5" align="center" gutterBottom>
            Account Requests
          </Typography>
          {loading ? (
            <Typography variant="h6" align="center">
              Loading account requests...
            </Typography>
          ) : (
            accountRequests.map((request) => {
              const { firstName, lastName, email, phoneNumber, status, initialDeposit } = request.data || {};
              return (
                <Paper key={request.id} style={{ padding: '20px', marginBottom: '20px' }}>
                  <Typography variant="h6">
                    {getFieldValue(firstName)} {getFieldValue(lastName)}
                  </Typography>
                  <Typography>Email: {getFieldValue(email)}</Typography>
                  <Typography>Phone Number: {getFieldValue(phoneNumber)}</Typography>
                  <Typography>Status: {getFieldValue(status)}</Typography>
                  <Typography>Initial Deposit: {getFieldValue(initialDeposit)}</Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => updateRequestStatus(request.id, 'approved')}
                    style={{ marginRight: '10px' }}
                  >
                    Approve
                  </Button>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => updateRequestStatus(request.id, 'denied')}
                    style={{ marginRight: '10px' }}
                  >
                    Deny
                  </Button>
                  <Button
                    variant="contained"
                    onClick={() => updateRequestStatus(request.id, 'hold')}
                    style={{ marginRight: '10px' }}
                  >
                    Hold
                  </Button>
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => setSelectedRequest(request)}
                    style={{ marginLeft: '10px' }}
                  >
                    View
                  </Button>
                </Paper>
              );
            })
          )}
          {selectedRequest && (
            <Paper style={{ padding: '20px', marginTop: '20px' }}>
              <Typography variant="h5">Account Request Details</Typography>
              <Typography>First Name: {getFieldValue(selectedRequest.data.firstName)}</Typography>
              <Typography>Last Name: {getFieldValue(selectedRequest.data.lastName)}</Typography>
              <Typography>Email: {getFieldValue(selectedRequest.data.email)}</Typography>
              <Typography>Phone Number: {getFieldValue(selectedRequest.data.phoneNumber)}</Typography>
              <Typography>Status: {getFieldValue(selectedRequest.data.status)}</Typography>
              <Typography>Initial Deposit: {getFieldValue(selectedRequest.data.initialDeposit)}</Typography>
            </Paper>
          )}
        </div>
      )}

{selectedTab === 1 && (
  <div>
    <Typography variant="h5" align="center" gutterBottom>
      Loan Requests
    </Typography>
    {loading ? (
      <Typography variant="h6" align="center">
        Loading loan requests...
      </Typography>
    ) : (
      loanRequests.map((loan) => {
        const { accountNumber, loanAmount, interestRate, numberOfYears, status } = loan.data || {};
        return (
          <Paper key={loan.id} style={{ padding: '20px', marginBottom: '20px' }}>
            <Typography variant="h6">Account Number: {getFieldValue(accountNumber)}</Typography>
            <Typography>Loan Amount: {getFieldValue(loanAmount)}</Typography>
            <Typography>Rate of Interest: {getFieldValue(interestRate)}%</Typography>
            <Typography>Number of Years: {getFieldValue(numberOfYears)}</Typography>
            <Typography>Status: {getFieldValue(status)}</Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={() => updateRequestStatus(loan.id, 'approved')} // Approve button
              style={{ marginRight: '10px' }}
            >
              Approve
            </Button>
            <Button
              variant="contained"
              color="secondary"
              onClick={() => updateRequestStatus(loan.id, 'denied')} // Deny button
              style={{ marginRight: '10px' }}
            >
              Deny
            </Button>
            <Button
              variant="contained"
              onClick={() => updateRequestStatus(loan.id, 'hold')} // Hold button
              style={{ marginRight: '10px' }}
            >
              Hold
            </Button>
            <Button
              variant="outlined"
              color="primary"
              onClick={() => setSelectedRequest(loan)} // View button
              style={{ marginLeft: '10px' }}
            >
              View
            </Button>
          </Paper>
        );
      })
    )}
    {selectedRequest && (
      <Paper style={{ padding: '20px', marginTop: '20px' }}>
        <Typography variant="h5">Loan Request Details</Typography>
        <Typography>Account Number: {getFieldValue(selectedRequest.data.accountNumber)}</Typography>
        <Typography>Loan Amount: {getFieldValue(selectedRequest.data.loanAmount)}</Typography>
        <Typography>Rate of Interest: {getFieldValue(selectedRequest.data.interestRate)}%</Typography>
        <Typography>Number of Years: {getFieldValue(selectedRequest.data.numberOfYears)}</Typography>
        <Typography>Status: {getFieldValue(selectedRequest.data.status)}</Typography>
      </Paper>
    )}
  </div>
)}


      {/* Customer Account Details Section */}
      {selectedTab === 2 && (
        <div>
          <Typography variant="h5" align="center" gutterBottom>
            Customer Account Details
          </Typography>
          {loadingAccounts ? (
            <Typography variant="h6" align="center">
              Loading customer account details...
            </Typography>
          ) : (
            accounts.map((account) => {
              return (
                <Paper key={account.id} style={{ padding: '20px', marginBottom: '20px' }}>
                  <Typography variant="h6">
                    {getFieldValue(account.data.firstName)} {getFieldValue(account.data.lastName)}
                  </Typography>
                  <Typography>Email: {getFieldValue(account.data.email)}</Typography>
                  <Typography>Account Number: {getFieldValue(account.data.accountNumber)}</Typography>
                  <Typography>IFSC Code: {getFieldValue(account.data.ifscCode)}</Typography>
                  <Typography>Initial Deposit: {getFieldValue(account.data.initialDeposit)}</Typography>
                  <Typography>Bank Balance: {getFieldValue(account.data.bankBalance)}</Typography>
                </Paper>
              );
            })
          )}
        </div>
      )}


  
    </Container>
  );
}

export default AdminDashboard;
