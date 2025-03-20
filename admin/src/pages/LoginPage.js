// src/pages/LoginPage.js
import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Container,
  Alert,
  CircularProgress,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginAdmin, clearError } from "../store/slices/authSlice";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, error } = useSelector((state) => state.auth);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      return;
    }

    try {
      await dispatch(loginAdmin({ email, password })).unwrap();
      navigate("/dashboard");
    } catch (err) {
      // Error is handled by the Redux state
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f5f5f5",
      }}
    >
      <Container maxWidth='sm'>
        <Card>
          <CardContent sx={{ p: 4 }}>
            <Typography variant='h4' component='h1' align='center' gutterBottom>
              Rider App Admin Panel
            </Typography>
            <Typography
              variant='body1'
              color='text.secondary'
              align='center'
              sx={{ mb: 4 }}
            >
              Log in to access the admin dashboard
            </Typography>

            {error && (
              <Alert
                severity='error'
                sx={{ mb: 3 }}
                onClose={() => dispatch(clearError())}
              >
                {error}
              </Alert>
            )}

            <Box component='form' onSubmit={handleLogin}>
              <TextField
                label='Email'
                type='email'
                fullWidth
                margin='normal'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <TextField
                label='Password'
                type='password'
                fullWidth
                margin='normal'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <Button
                type='submit'
                variant='contained'
                fullWidth
                size='large'
                sx={{ mt: 3 }}
                disabled={isLoading}
              >
                {isLoading ? <CircularProgress size={24} /> : "Log In"}
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default LoginPage;
