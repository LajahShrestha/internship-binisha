import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  TextField,
  Typography,
  Grid,
  Paper,
  Alert,
  IconButton,
  InputAdornment,
  CircularProgress,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import axios from "axios";

const Home = () => {
  const navigate = useNavigate();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const isLoggedIn = sessionStorage.getItem("isLoggedIn");
    const remember = localStorage.getItem("expiryDate");
    if (remember > Date.now() || isLoggedIn) {
      sessionStorage.setItem("isLoggedIn", "true");
    } else {
      sessionStorage.removeItem("isLoggedIn");
      localStorage.removeItem("expiryDate");
      navigate("/");
    }
  }, [navigate]);

  const toggleCurrentPasswordVisibility = () => {
    setShowCurrentPassword((prevShowPassword) => !prevShowPassword);
  };

  const toggleNewPasswordVisibility = () => {
    setShowNewPassword((prevShowPassword) => !prevShowPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword((prevShowPassword) => !prevShowPassword);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    if (name === "currentPassword") {
      setCurrentPassword(value);
    } else if (name === "newPassword") {
      setNewPassword(value);
    } else if (name === "confirmNewPassword") {
      setConfirmNewPassword(value);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Validate form fields
    if (!currentPassword || !newPassword || !confirmNewPassword) {
      setError("Please fill in all fields");
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setError("Passwords do not match");
      return;
    }

    if (newPassword.length < 8) {
      setError("Password length must be more than 8 characters");
      return;
    }
    setError("");

    try {
      // Make the API request to your backend endpoint for user registration
      setLoading(true);
      const authToken = localStorage.getItem("token");
      if (!authToken) {
        // Handle the case where the user is not authenticated
        setLoading(false);
        navigate("/home");

        return;
      }
      const response = await axios.post(
        "http://localhost:5000/api/users/change-password",
        {
          password: currentPassword,
          newPassword: newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      setLoading(false);
      // Check the response for success (optional, depending on your backend API)
      if (response.status === 200) {
        setCurrentPassword("");
        setNewPassword("");
        setConfirmNewPassword("");
        setError(false);
        setSuccess(true);
        setTimeout(() => {
          setSuccess(false);
        }, 2000);
      }
    } catch (error) {
      // Handle API request errors here
      if (error.response) setError(error.response.data.message);
      else setError("Error while changing password");
      setLoading(false);
    }
  };

  return (
    <Grid
      container
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      padding={5}
      style={{ backgroundColor: "#f3f3f3" }}
    >
      <Grid item xs={12} sm={8} md={6} lg={4}>
        <Paper elevation={3} sx={{ padding: 5 }}>
          <Typography variant="h5" gutterBottom sx={{ color: "#073cb5" }}>
            Change Password
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              name="currentPassword"
              label="Current Password"
              type={showCurrentPassword ? "text" : "password"}
              value={currentPassword}
              onChange={handleChange}
              fullWidth
              margin="normal"
              required
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={toggleCurrentPasswordVisibility}
                      edge="end"
                    >
                      {showCurrentPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              name="newPassword"
              label="New Password"
              type={showNewPassword ? "text" : "password"}
              value={newPassword}
              onChange={handleChange}
              fullWidth
              margin="normal"
              required
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={toggleNewPasswordVisibility}
                      edge="end"
                    >
                      {showNewPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              name="confirmNewPassword"
              label="Confirm Password"
              type={showConfirmPassword ? "text" : "password"}
              value={confirmNewPassword}
              onChange={handleChange}
              fullWidth
              margin="normal"
              required
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={toggleConfirmPasswordVisibility}
                      edge="end"
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            {error && (
              <Alert severity="error" sx={{ marginBottom: 2 }}>
                {error}
              </Alert>
            )}
            {success && (
              <Alert severity="success" sx={{ marginBottom: 2 }}>
                Password changed successfully!
              </Alert>
            )}
            <Grid container justifyContent="flex-end">
              <Button
                type="submit"
                variant="contained"
                color="success"
                disabled={loading}
                sx={{ marginTop: 2, textTransform: "none" }}
              >
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  "Confirm"
                )}
              </Button>
            </Grid>
          </form>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default Home;
