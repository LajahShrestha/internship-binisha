import React, { useState, useEffect } from "react";
import {
  Button,
  Grid,
  TextField,
  Typography,
  Link,
  Box,
  FormControlLabel,
  Checkbox,
  InputAdornment,
  CircularProgress,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const LoginPage = () => {
  const [validated, setValidated] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [redirectHome, setRedirectHome] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const navigate = useNavigate();

  useEffect(() => {
    const isLoggedIn = sessionStorage.getItem("isLoggedIn");
    setRememberMe(isLoggedIn);
    setRedirectHome(isLoggedIn);
  }, []);

  useEffect(() => {
    const expiryDate = localStorage.getItem("expiryDate");
    if (rememberMe && expiryDate && new Date(expiryDate) > new Date()) {
      setRedirectHome(true);
    }
  }, [rememberMe]);

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.stopPropagation();
    }

    setValidated(true);

    if (form.checkValidity() === true) {
      const email = form.elements.email.value;
      const password = form.elements.password.value;

      setLoading(true); // Set loading to true before making the API request

      try {
        const response = await axios.post(
          "http://localhost:5000/api/users/login",
          {
            email: email,
            password: password,
          }
        );

        setLoading(false); // Set loading back to false after the API request

        // Assuming the backend returns a token on successful login
        const token = response.data.token;
        if (token) {
          localStorage.setItem("token", token);
          sessionStorage.setItem("isLoggedIn", "true");
          if (rememberMe) {
            const expiryDate = new Date();
            expiryDate.setDate(expiryDate.getDate() + 1);
            localStorage.setItem("expiryDate", expiryDate.toISOString());
          } else {
            localStorage.removeItem("expiryDate");
          }

          navigate("/home");
        } else {
          setError("Incorrect email or password");
        }
      } catch (error) {
        // Handle API request errors here
        if (error.response) setError(error.response.data.message);
        else setError("Error while signing in");
        setLoading(false);
      }
    }
  };

  const handleRememberMeChange = (event) => {
    setRememberMe(event.target.checked);
  };

  if (redirectHome) {
    navigate("/home");
  }

  return (
    <Grid
      container
      style={{
        height: "100%",
      }}
      xs={12}
      alignItems="center"
    >
      {!isSmallScreen && (
        <Grid item sm={5} lg={6} style={{ height: "100%" }}>
          <img
            src="/login.jpg"
            alt="Login"
            style={{
              width: "100%",
              height: "100vh",
              objectFit: "cover",
            }}
          />
        </Grid>
      )}
      <Grid
        item
        sm={isSmallScreen ? 12 : 7}
        lg={6}
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Box
          sx={{
            p: 3,
            width: isSmallScreen ? "100%" : "80%",
            maxWidth: isSmallScreen ? "100%" : "400px",
            height: "100%",
          }}
        >
          <Typography variant="h4" align="center" gutterBottom>
            Login
          </Typography>
          <form noValidate validated={validated} onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  id="email"
                  label="Email"
                  placeholder="Enter email"
                  required
                  fullWidth
                  variant="outlined"
                  error={validated && !loading}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  id="password"
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter password"
                  required
                  fullWidth
                  variant="outlined"
                  error={validated && !loading}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <Button onClick={handleShowPassword}>
                          {showPassword ? "Hide" : "Show"}
                        </Button>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              {error ? (
                <Grid item xs={12}>
                  <Typography variant="body2" color="error">
                    {error}
                  </Typography>
                </Grid>
              ) : (
                <> </>
              )}
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Checkbox
                      color="primary"
                      checked={rememberMe}
                      onChange={handleRememberMeChange}
                    />
                  }
                  label="Remember Me"
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  variant="contained"
                  color="primary"
                  type="submit"
                  size="medium"
                  fullWidth
                  disabled={loading}
                  sx={{ textTransform: "none", fontSize: "1rem" }}
                >
                  {loading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    "Sign In"
                  )}
                </Button>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body2" align="center">
                  <Link href="/forgot-password">Forgot Password?</Link>
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body2" align="center">
                  Don't have an account? <Link href="/register">Sign Up</Link>
                </Typography>
              </Grid>
            </Grid>
          </form>
        </Box>
      </Grid>
    </Grid>
  );
};

export default LoginPage;
