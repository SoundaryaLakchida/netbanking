import React, { useState } from 'react';
import {
  TextField,
  Button,
  Typography,
  Container,
  IconButton,
  InputAdornment,
  Checkbox,
  FormControlLabel
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_KEY = 'AIzaSyAY1OHYjcnFV5ONKE91PjW_D_J6N4a_7Pc';
const PROJECT_ID = 'bank-84ba3';
const BASE_URL = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents`;

function NewCustomerDashboard() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    phoneNumber: '',
    email: '',
    aadharNumber: '',
    panNumber: '',
    communicationAddress: '',
    permanentAddress: '',
    employmentType: '',
    annualIncome: '',
    employerName: '',
    motherName: '',
    fatherName: '',
    nomineeName: '',
    nomineeRelation: '',
    nomineeDOB: '',
    nomineeAddress: '',
    country: '',
    state: '',
    city: '',
    initialDeposit: 0, // Keep initial deposit as a number
  });

  const [aadharFile, setAadharFile] = useState(null);
  const [panFile, setPanFile] = useState(null);
  const [idProofFile, setIdProofFile] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [sameAddress, setSameAddress] = useState(false);

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: name === 'initialDeposit' ? parseFloat(value) : value, // Use parseFloat for initial deposit
    }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files.length > 0) {
      const file = files[0];
      if (name === 'aadharFile') setAadharFile(file);
      if (name === 'panFile') setPanFile(file);
      if (name === 'idProofFile') setIdProofFile(file);
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
      const aadharBase64 = aadharFile ? await convertFileToBase64(aadharFile) : '';
      const panBase64 = panFile ? await convertFileToBase64(panFile) : '';
      const idProofBase64 = idProofFile ? await convertFileToBase64(idProofFile) : '';

      // Prepare Firestore REST API request payload
      const payload = {
        fields: {
          firstName: { stringValue: formData.firstName },
          lastName: { stringValue: formData.lastName },
          dateOfBirth: { stringValue: formData.dateOfBirth },
          phoneNumber: { stringValue: formData.phoneNumber },
          email: { stringValue: formData.email },
          aadharNumber: { stringValue: btoa(formData.aadharNumber) }, // Encrypt AADHAR number
          panNumber: { stringValue: btoa(formData.panNumber) }, // Encrypt PAN number
          communicationAddress: { stringValue: formData.communicationAddress },
          permanentAddress: { stringValue: formData.permanentAddress },
          employmentType: { stringValue: formData.employmentType },
          annualIncome: { stringValue: formData.annualIncome },
          employerName: { stringValue: formData.employerName },
          motherName: { stringValue: formData.motherName },
          fatherName: { stringValue: formData.fatherName },
          nomineeName: { stringValue: formData.nomineeName },
          nomineeRelation: { stringValue: formData.nomineeRelation },
          nomineeDOB: { stringValue: formData.nomineeDOB },
          nomineeAddress: { stringValue: formData.nomineeAddress },
          country: { stringValue: formData.country },
          state: { stringValue: formData.state },
          city: { stringValue: formData.city },
          initialDeposit: { doubleValue: formData.initialDeposit }, // Send as a number
          bankBalance: { doubleValue: formData.initialDeposit }, // Set bank balance equal to initial deposit
          aadharFile: { stringValue: aadharBase64 },
          panFile: { stringValue: panBase64 },
          idProofFile: { stringValue: idProofBase64 },
          status: { stringValue: 'pending' },
        },
      };

      // Post data to Firestore
      const response = await axios.post(`${BASE_URL}/accountRequests?key=${API_KEY}`, payload);

      if (response.status === 200) {
        alert('Account creation request submitted successfully');
        navigate('/');
      }
    } catch (err) {
      console.error('Error submitting form: ', err);
      alert('Failed to submit the account creation request');
    }
  };

  return (
    <Container>
      <Typography variant="h4" align="center" gutterBottom>
        New Customer Account Creation
      </Typography>
      <form onSubmit={handleSubmit}>
        {/* Existing form fields */}
        <TextField label="First Name" name="firstName" value={formData.firstName} onChange={handleInputChange} fullWidth margin="normal" required />
        <TextField label="Last Name" name="lastName" value={formData.lastName} onChange={handleInputChange} fullWidth margin="normal" required />
        <TextField label="Date of Birth" type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleInputChange} fullWidth margin="normal" InputLabelProps={{ shrink: true }} required />
        <TextField label="Phone Number" name="phoneNumber" value={formData.phoneNumber} onChange={handleInputChange} fullWidth margin="normal" required />
        <TextField label="Email" name="email" value={formData.email} onChange={handleInputChange} fullWidth margin="normal" required />
        <TextField
          label="AADHAR Number"
          name="aadharNumber"
          value={formData.aadharNumber}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
          required
          type={showPassword ? 'text' : 'password'}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <TextField
          label="PAN Number"
          name="panNumber"
          value={formData.panNumber}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
          required
          type={showPassword ? 'text' : 'password'}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <TextField label="Communication Address" name="communicationAddress" value={formData.communicationAddress} onChange={handleInputChange} fullWidth margin="normal" required />
        <FormControlLabel
          control={
            <Checkbox
              checked={sameAddress}
              onChange={() => {
                setSameAddress(!sameAddress);
                if (!sameAddress) {
                  setFormData((prevData) => ({
                    ...prevData,
                    permanentAddress: prevData.communicationAddress,
                  }));
                }
              }}
            />
          }
          label="Permanent address is same as communication address"
        />
        {!sameAddress && (
          <TextField label="Permanent Address" name="permanentAddress" value={formData.permanentAddress} onChange={handleInputChange} fullWidth margin="normal" required />
        )}
        <TextField label="Employment Type" name="employmentType" value={formData.employmentType} onChange={handleInputChange} fullWidth margin="normal" required />
        <TextField label="Annual Income" name="annualIncome" value={formData.annualIncome} onChange={handleInputChange} fullWidth margin="normal" required />
        <TextField label="Employer Name" name="employerName" value={formData.employerName} onChange={handleInputChange} fullWidth margin="normal" required />
        <TextField label="Mother's Name" name="motherName" value={formData.motherName} onChange={handleInputChange} fullWidth margin="normal" required />
        <TextField label="Father's Name" name="fatherName" value={formData.fatherName} onChange={handleInputChange} fullWidth margin="normal" required />
        <TextField label="Nominee Name" name="nomineeName" value={formData.nomineeName} onChange={handleInputChange} fullWidth margin="normal" required />
        <TextField label="Nominee Relation" name="nomineeRelation" value={formData.nomineeRelation} onChange={handleInputChange} fullWidth margin="normal" required />
        <TextField label="Nominee Date of Birth" type="date" name="nomineeDOB" value={formData.nomineeDOB} onChange={handleInputChange} fullWidth margin="normal" InputLabelProps={{ shrink: true }} required />
        <TextField label="Nominee Address" name="nomineeAddress" value={formData.nomineeAddress} onChange={handleInputChange} fullWidth margin="normal" required />
        <TextField label="Country" name="country" value={formData.country} onChange={handleInputChange} fullWidth margin="normal" required />
        <TextField label="State" name="state" value={formData.state} onChange={handleInputChange} fullWidth margin="normal" required />
        <TextField label="City" name="city" value={formData.city} onChange={handleInputChange} fullWidth margin="normal" required />
        <TextField label="Initial Deposit" name="initialDeposit" value={formData.initialDeposit} onChange={handleInputChange} fullWidth margin="normal" type="number" required />

        <input type="file" name="aadharFile" accept="image/*" onChange={handleFileChange} required />
        <input type="file" name="panFile" accept="image/*" onChange={handleFileChange} required />
        <input type="file" name="idProofFile" accept="image/*" onChange={handleFileChange} required />

        <Button type="submit" variant="contained" color="primary" style={{ marginTop: '20px' }}>
          Submit
        </Button>
      </form>
    </Container>
  );
}

export default NewCustomerDashboard;
