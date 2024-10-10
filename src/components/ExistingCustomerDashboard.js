import React, { useState, useEffect } from 'react';
import { Container, Typography, Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const FIRESTORE_API_URL = "https://firestore.googleapis.com/v1/projects/YOUR_PROJECT_ID/databases/(default)/documents";
const API_KEY = "YOUR_FIREBASE_API_KEY";

function ExistingCustomerDashboard({ loggedInEmail }) {
  const navigate = useNavigate();
  const [accountDetails, setAccountDetails] = useState({});
//   const [open, setOpen] = useState(false);
  const [loanOpen, setLoanOpen] = useState(false); // State for EMI dialog
  const [loanAmount, setLoanAmount] = useState("");
  const [interestRate, setInterestRate] = useState("");
  const [years, setYears] = useState("");
  const [emi, setEmi] = useState(null); // State to store EMI result

  useEffect(() => {
    const fetchAccountDetails = async () => {
      try {
        const response = await fetch(`${FIRESTORE_API_URL}/accounts?key=${API_KEY}`);
        const data = await response.json();

        if (data.documents && data.documents.length > 0) {
          // Find the specific document matching the logged-in email
          const userDocument = data.documents.find(
            (doc) => doc.fields.email.stringValue === loggedInEmail
          );

          if (userDocument) {
            const accountData = userDocument.fields;
            setAccountDetails({
              accountNumber: accountData.accountNumber.stringValue,
              IFSCCode: accountData.IFSCCode.stringValue,
              email: accountData.email.stringValue,
              balance: parseFloat(accountData.balance.integerValue),
            });
          } else {
            console.error("Account not found for the provided email.");
          }
        }
      } catch (error) {
        console.error("Error fetching account details: ", error);
      }
    };

    fetchAccountDetails();
  }, [loggedInEmail]);

  const handleViewBalance = () => {
    alert(`Your current balance is: $${accountDetails.balance}`);
  };

  const handleLoanOpen = () => {
    setLoanOpen(true);
  };

  const handleLoanClose = () => {
    setLoanOpen(false);
    setEmi(null); // Reset EMI when dialog is closed
  };

  const calculateEMI = () => {
    const principal = parseFloat(loanAmount);
    const annualRate = parseFloat(interestRate) / 100;
    const monthlyRate = annualRate / 12;
    const totalMonths = parseInt(years) * 12;

    // EMI Calculation
    const emiValue = principal * monthlyRate * Math.pow(1 + monthlyRate, totalMonths) / (Math.pow(1 + monthlyRate, totalMonths) - 1);
    setEmi(emiValue.toFixed(2)); // Store the EMI value
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h4" align="center" gutterBottom>
        Welcome to Your Account Dashboard
      </Typography>
      {accountDetails.email ? (
        <>
          <Typography variant="h6" align="center" gutterBottom>
            Account Number: {accountDetails.accountNumber}
          </Typography>
          <Typography variant="h6" align="center" gutterBottom>
            IFSC Code: {accountDetails.IFSCCode}
          </Typography>
          <Typography variant="h6" align="center" gutterBottom>
            Email: {accountDetails.email}
          </Typography>
        </>
      ) : (
        <Typography variant="h6" align="center" color="error">
          Account details not found for the logged-in email.
        </Typography>
      )}

      <Grid container spacing={3} style={{ marginTop: '20px' }}>
        <Grid item xs={12} sm={6}>
          <Button variant="contained" color="primary" fullWidth onClick={handleViewBalance}>
            View Balance
          </Button>
        </Grid>

        <Grid item xs={12} sm={6}>
          <Button variant="contained" color="primary" fullWidth onClick={() => navigate("/requestLoan")}>
            Apply for a Loan
          </Button>
        </Grid>

        <Grid item xs={12} sm={6}>
          <Button variant="contained" color="primary" fullWidth>
            Apply for a Credit Card
          </Button>
        </Grid>

        <Grid item xs={12} sm={6}>
          <Button variant="contained" color="primary" fullWidth onClick={handleLoanOpen}>
            Loan EMI Calculator
          </Button>
        </Grid>

        <Grid item xs={12} sm={6}>
          <Button variant="contained" color="primary" fullWidth>
            View Past Transactions
          </Button>
        </Grid>

        <Grid item xs={12} sm={6}>
          <Button variant="contained" color="secondary" fullWidth onClick={() => navigate("/customer/new")}>
            Create an Account
          </Button>
        </Grid>
      </Grid>

      {/* Loan EMI Calculator Dialog */}
      <Dialog open={loanOpen} onClose={handleLoanClose}>
        <DialogTitle>Loan EMI Calculator</DialogTitle>
        <DialogContent>
          <TextField
            label="Loan Amount"
            type="number"
            fullWidth
            margin="dense"
            value={loanAmount}
            onChange={(e) => setLoanAmount(e.target.value)}
          />
          <TextField
            label="Annual Interest Rate (%)"
            type="number"
            fullWidth
            margin="dense"
            value={interestRate}
            onChange={(e) => setInterestRate(e.target.value)}
          />
          <TextField
            label="Number of Years"
            type="number"
            fullWidth
            margin="dense"
            value={years}
            onChange={(e) => setYears(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleLoanClose} color="primary">
            Cancel
          </Button>
          <Button onClick={calculateEMI} color="primary">
            Calculate EMI
          </Button>
        </DialogActions>
        {emi && (
          <DialogContent>
            <Typography variant="h6">
              Your Monthly EMI: ${emi}
            </Typography>
          </DialogContent>
        )}
      </Dialog>
    </Container>
  );
}

export default ExistingCustomerDashboard;
