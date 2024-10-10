import React from 'react';
import { Container, CssBaseline, Typography } from '@mui/material';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginSignup from './components/LoginSignup';
import AdminDashboard from './components/AdminDashboard';
import NewCustomerDashboard from './components/NewCustomerDashboard';
import ExistingCustomerDashboard from './components/ExistingCustomerDashboard';
import LoanRequestForm from './components/LoanRequestForm';
import AdminLoanRequestDashboard from './components/AdminLoanRequestDashboard';

function App() {
  return (
    <Router>
      <Container component="main" maxWidth="md">
        <CssBaseline />
        {/* Main Heading */}
        <Typography variant="h4" align="center" style={{ margin: '20px 0' }}>
          Net Banking
        </Typography>

        {/* Routing Configuration */}
        <Routes>
          <Route path="/" element={<LoginSignup />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/customer/new" element={<NewCustomerDashboard />} />
          <Route path="/customer/existing" element={<ExistingCustomerDashboard />} />
          <Route path="/requestLoan" element={<LoanRequestForm />} />
          <Route path="/admin/loan-requests" element={<AdminLoanRequestDashboard />} />
        </Routes>
      </Container>
    </Router>
  );
}

export default App;

