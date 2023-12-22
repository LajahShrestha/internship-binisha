import React, { useState } from "react";
import {
  Button,
  TextField,
  Typography,
  Grid,
  Paper,
  Alert,
  CircularProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (event) => {
    setEmail(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Validate email
    if (!email) {
      setError("Please enter your email");
      return;
    }
    try {
      // Make the API request to your backend endpoint for user registration
      setLoading(true);
      const response = await axios.post(
        "http://localhost:5000/api/users/forgot-password",
        { email: email }
      );

      setLoading(false);
      // Check the response for success (optional, depending on your backend API)
      if (response.status === 200) {
        setEmail("");
        setSuccess(true);
        setError(false);
        setTimeout(() => {
          setSuccess(false);
          navigate("/");
        }, 2000);
      }
    } catch (error) {
      // Handle API request errors here
      if (error.response) setError(error.response.data.message);
      else setError("Error while resetting password");
      setLoading(false);
    }
  };

  return (
    <Grid
      container
      justifyContent="center"
      minHeight="100vh"
      padding={4}
      style={{ backgroundColor: "#f3f3f3" }}
    >
      <Grid item xs={12} sm={8} md={6} lg={4}>
        <Paper elevation={3} sx={{ padding: 5 }}>
          <Typography
            variant="h5"
            sx={{ marginBottom: 3, color: "#073cb5" }}
            align="center"
          >
            Forgot Password
          </Typography>
          <form onSubmit={handleSubmit}>
            <Typography variant="h6">Enter your email:</Typography>
            <TextField
              name="email"
              label="Email"
              value={email}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            {error && (
              <Alert severity="error" sx={{ marginBottom: 2 }}>
                {error}
              </Alert>
            )}
            {success && (
              <Alert severity="success" sx={{ marginBottom: 2 }}>
                Password reset instructions sent to email!
              </Alert>
            )}
            <Grid container justifyContent="flex-end">
              <Button
                type="submit"
                variant="contained"
                color="error"
                disabled={loading}
                sx={{ marginTop: 2, textTransform: "none" }}
              >
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  "Reset"
                )}
              </Button>
            </Grid>
          </form>
        </Paper>
      </Grid>
    </Grid>
  );
}

export default ForgotPassword;
