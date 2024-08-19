import React, { useState } from "react";
import {
  Container,
  Grid,
  Typography,
  Button,
  Box,
  TextField,
} from "@mui/material";
import { usePasswordResetMutation } from "../../generated/graphql";
import { useNavigate } from "react-router-dom";
import { useAlert } from "../../providers/AlertProvider";

const PasswordResetPage: React.FC = () => {
  const [oldPassword, setOldPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");

  const [, executeMutation] = usePasswordResetMutation();
  const navigate = useNavigate();
  const alert = useAlert();

  const handlePasswordReset = async () => {
    if (newPassword !== confirmPassword) {
      alert("New passwords do not match", "error");
      return;
    }

    const { data, error } = await executeMutation({
      oldPassword,
      newPassword,
    });

    if ((data?.passwordChange?.errors ?? []).length > 0) {
      data?.passwordChange?.errors.forEach((err) =>
        alert(err.message ?? "Unexpected error", "error")
      );
    } else if ((data?.passwordChange?.errors ?? []).length === 0) {
      alert("Password reset successful!", "success");
      navigate("/user");
    } else if (error) {
      alert(error.message, "error");
    }
  };

  return (
    <Container>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          paddingY: 4,
        }}
      >
        <Typography variant="h4" sx={{ alignSelf: "center" }}>
          Reset Password
        </Typography>
        <Grid container spacing={4} justifyContent="center">
          <Grid item xs={12} md={6}>
            <Box
              component="form"
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
              }}
            >
              <TextField
                label="Old password"
                type="password"
                variant="outlined"
                fullWidth
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
              />
              <TextField
                label="New Password"
                type="password"
                variant="outlined"
                fullWidth
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <TextField
                label="Confirm New Password"
                type="password"
                variant="outlined"
                fullWidth
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={handlePasswordReset}
              >
                Reset Password
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default PasswordResetPage;
