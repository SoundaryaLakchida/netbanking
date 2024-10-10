import React, { useState } from 'react';
import {
  TextField,
  Button,
  Typography,
  Container,
  IconButton,
  InputAdornment,
} from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_KEY = 'AIzaSyAY1OHYjcnFV5ONKE91PjW_D_J6N4a_7Pc';
const PROJECT_ID = 'bank-84ba3';
const BASE_URL = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents`;

function LoanRequestForm() {
  const [formData, setFormData] = useState({
    loanAmount: '',
    interestRate: '',
    loanYears: '',
    accountNumber: '',
  });

  const [bankStatementFile, setBankStatementFile] = useState(null);
  const [salarySlipFile, setSalarySlipFile] = useState(null);

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files.length > 0) {
      const file = files[0];
      if (name === 'bankStatementFile') setBankStatementFile(file);
      if (name === 'salarySlipFile') setSalarySlipFile(file);
    }
  };

  const convertFileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Convert files to Base64
      const bankStatementBase64 = bankStatementFile ? await convertFileToBase64(bankStatementFile) : '';
      const salarySlipBase64 = salarySlipFile ? await convertFileToBase64(salarySlipFile) : '';

      // Prepare Firestore REST API request payload
      const payload = {
        fields: {
          loanAmount: { doubleValue: parseFloat(formData.loanAmount) },
          interestRate: { stringValue: formData.interestRate },
          loanYears: { stringValue: formData.loanYears },
          accountNumber: { stringValue: btoa(formData.accountNumber) }, // Encrypt account number
          bankStatementFile: { stringValue: bankStatementBase64 },
          salarySlipFile: { stringValue: salarySlipBase64 },
          status: { stringValue: 'pending' },
        },
      };

      // Post data to Firestore
      const response = await axios.post(`${BASE_URL}/loanRequests?key=${API_KEY}`, payload);

      if (response.status === 200) {
        alert('Loan request submitted successfully');
        navigate('/');
      }
    } catch (err) {
      console.error('Error submitting form: ', err);
      alert('Failed to submit the loan request');
    }
  };

  return (
    <Container>
      <Typography variant="h4" align="center" gutterBottom>
        Loan Request Form
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Loan Amount"
          name="loanAmount"
          value={formData.loanAmount}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
          type="number"
          required
        />
        <TextField
          label="Rate of Interest"
          name="interestRate"
          value={formData.interestRate}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Number of Years"
          name="loanYears"
          value={formData.loanYears}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
          type="number"
          required
        />
        <TextField
          label="Account Number"
          name="accountNumber"
          value={formData.accountNumber}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
          required
          type="password"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton edge="end">
                  {/* Add visibility toggle if needed */}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <input type="file" name="bankStatementFile" accept="image/*" onChange={handleFileChange} required />
        <input type="file" name="salarySlipFile" accept="image/*" onChange={handleFileChange} required />

        <Button type="submit" variant="contained" color="primary" style={{ marginTop: '20px' }}>
          Submit
        </Button>
      </form>
    </Container>
  );
}

export default LoanRequestForm;
