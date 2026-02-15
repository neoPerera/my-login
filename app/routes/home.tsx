import type { Route } from "./+types/home";
import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  CircularProgress,
  Paper,
} from "@mui/material";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Login" },
    { name: "description", content: "Sign in" },
  ];
}

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Allowed origins for cross-origin postMessage (caller apps)
  // Update these to match your caller app origins
  const ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://localhost:5173",
    "http://localhost:4000",
    // Add production origins as needed
    // "https://app1.example.com",
    // "https://app2.example.com",
  ];

  const getPostMessageOrigin = (): string => {
    const params = new URLSearchParams(window.location.search);
    const returnTo = params.get("returnTo");

    try {
      if (returnTo) {
        const parsed = new URL(returnTo);
        if (ALLOWED_ORIGINS.includes(parsed.origin)) {
          return parsed.origin;
        }
      }
    } catch (err) {
      // Invalid returnTo format, fall back to wildcard
    }
    // Fallback (less secure, only use for dev)
    return "*";
  };

  const handleLogin = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${window.env?.REACT_APP_API_URL}auth/login`,
        { username, password }
      );

      if (response.data?.message === "Authentication successful" && response.data?.token) {
        const token = response.data.token;
        localStorage.setItem("jwt_token", token);
        localStorage.setItem("username", username);
        localStorage.setItem("lastLoginTime", Date.now().toString());

        await Swal.fire({
          icon: "success",
          title: "Login successful",
          showConfirmButton: false,
          timer: 900,
        });

        if (window.opener) {
          const targetOrigin = getPostMessageOrigin();
          try {
            window.opener.postMessage(
              { type: "auth-success", token, username },
              targetOrigin
            );
          } catch (e) {}
          window.close();
        } else {
          window.location.href = "/";
        }
      } else {
        await Swal.fire("Login failed", response.data?.message || "Invalid credentials", "error");
        if (window.opener) {
          const targetOrigin = getPostMessageOrigin();
          try {
            window.opener.postMessage(
              { type: "auth-failure", message: response.data?.message || "Invalid credentials" },
              targetOrigin
            );
          } catch (e) {}
          window.close();
        }
      }
    } catch (error) {
      console.error("Login error:", error);
      await Swal.fire("Error", "Something went wrong", "error");
      if (window.opener) {
        const targetOrigin = getPostMessageOrigin();
        try {
          window.opener.postMessage(
            { type: "auth-failure", message: "Network or server error" },
            targetOrigin
          );
        } catch (e) {}
        window.close();
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="xs">
      <Box sx={{ height: "100vh", display: "flex", alignItems: "center" }}>
        <Paper elevation={3} sx={{ p: 4, width: "100%" }}>
          <Typography variant="h5" component="h1" align="center" gutterBottom>
            Sign in
          </Typography>

          <Box component="form" noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="Username"
              name="username"
              autoComplete="username"
              autoFocus
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <Button
              type="button"
              fullWidth
              variant="contained"
              color="primary"
              sx={{ mt: 3, mb: 2 }}
              onClick={handleLogin}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : "Sign In"}
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}
