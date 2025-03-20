// src/pages/SettingsPage.js
import React, { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Grid,
  Divider,
  Switch,
  FormControlLabel,
  Tabs,
  Tab,
} from "@mui/material";
import Layout from "../components/common/Layout";

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [settings, setSettings] = useState({
    baseFare: 2.5,
    perKmRate: 1.5,
    perMinuteRate: 0.3,
    serviceFee: 10,
    cancellationFee: 5,
    riderCommission: 80,
    maxWaitTime: 5,
    enableSurge: true,
    surgeMultiplier: 1.5,
    enableReferrals: true,
    referralAmount: 10,
    minRiderRating: 4.0,
    enableGenderPreference: true,
  });

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleChange = (field) => (event) => {
    const value =
      event.target.type === "checkbox"
        ? event.target.checked
        : event.target.value;
    setSettings({ ...settings, [field]: value });
  };

  const handleSave = () => {
    // In a real app, you would dispatch an action to save settings to the server
    console.log("Saving settings:", settings);
    // Show success message
    alert("Settings saved successfully!");
  };

  return (
    <Layout title='Settings'>
      <Box sx={{ mb: 4 }}>
        <Typography variant='h4' gutterBottom>
          Platform Settings
        </Typography>
        <Typography variant='body1' color='text.secondary'>
          Configure system-wide settings for the rider application
        </Typography>
      </Box>

      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          indicatorColor='primary'
          textColor='primary'
          variant='fullWidth'
        >
          <Tab label='Pricing' />
          <Tab label='Platform' />
          <Tab label='Notifications' />
          <Tab label='Security' />
        </Tabs>
      </Paper>

      {/* Pricing Settings */}
      {activeTab === 0 && (
        <Paper sx={{ p: 3 }}>
          <Typography variant='h6' gutterBottom>
            Pricing Configuration
          </Typography>
          <Typography variant='body2' color='text.secondary' paragraph>
            Configure the fare calculation parameters and fees
          </Typography>
          <Divider sx={{ mb: 3 }} />

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                label='Base Fare ($)'
                type='number'
                value={settings.baseFare}
                onChange={handleChange("baseFare")}
                fullWidth
                InputProps={{
                  inputProps: { min: 0, step: 0.1 },
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label='Per Kilometer Rate ($)'
                type='number'
                value={settings.perKmRate}
                onChange={handleChange("perKmRate")}
                fullWidth
                InputProps={{
                  inputProps: { min: 0, step: 0.1 },
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label='Per Minute Rate ($)'
                type='number'
                value={settings.perMinuteRate}
                onChange={handleChange("perMinuteRate")}
                fullWidth
                InputProps={{
                  inputProps: { min: 0, step: 0.1 },
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label='Service Fee (%)'
                type='number'
                value={settings.serviceFee}
                onChange={handleChange("serviceFee")}
                fullWidth
                InputProps={{
                  inputProps: { min: 0, max: 100, step: 1 },
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label='Cancellation Fee ($)'
                type='number'
                value={settings.cancellationFee}
                onChange={handleChange("cancellationFee")}
                fullWidth
                InputProps={{
                  inputProps: { min: 0, step: 0.5 },
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label='Rider Commission (%)'
                type='number'
                value={settings.riderCommission}
                onChange={handleChange("riderCommission")}
                fullWidth
                InputProps={{
                  inputProps: { min: 0, max: 100, step: 1 },
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.enableSurge}
                    onChange={handleChange("enableSurge")}
                    color='primary'
                  />
                }
                label='Enable Surge Pricing'
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label='Surge Multiplier'
                type='number'
                value={settings.surgeMultiplier}
                onChange={handleChange("surgeMultiplier")}
                fullWidth
                disabled={!settings.enableSurge}
                InputProps={{
                  inputProps: { min: 1, max: 5, step: 0.1 },
                }}
              />
            </Grid>
          </Grid>
        </Paper>
      )}

      {/* Platform Settings */}
      {activeTab === 1 && (
        <Paper sx={{ p: 3 }}>
          <Typography variant='h6' gutterBottom>
            Platform Configuration
          </Typography>
          <Typography variant='body2' color='text.secondary' paragraph>
            Configure general platform settings
          </Typography>
          <Divider sx={{ mb: 3 }} />

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                label='Maximum Wait Time (minutes)'
                type='number'
                value={settings.maxWaitTime}
                onChange={handleChange("maxWaitTime")}
                fullWidth
                InputProps={{
                  inputProps: { min: 1, step: 1 },
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label='Minimum Rider Rating'
                type='number'
                value={settings.minRiderRating}
                onChange={handleChange("minRiderRating")}
                fullWidth
                InputProps={{
                  inputProps: { min: 1, max: 5, step: 0.1 },
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.enableReferrals}
                    onChange={handleChange("enableReferrals")}
                    color='primary'
                  />
                }
                label='Enable Referrals Program'
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label='Referral Amount ($)'
                type='number'
                value={settings.referralAmount}
                onChange={handleChange("referralAmount")}
                fullWidth
                disabled={!settings.enableReferrals}
                InputProps={{
                  inputProps: { min: 0, step: 1 },
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.enableGenderPreference}
                    onChange={handleChange("enableGenderPreference")}
                    color='primary'
                  />
                }
                label='Enable Gender Preference'
              />
            </Grid>
          </Grid>
        </Paper>
      )}

      {/* Placeholder for other tabs */}
      {activeTab === 2 && (
        <Paper sx={{ p: 3 }}>
          <Typography variant='h6' gutterBottom>
            Notification Settings
          </Typography>
          <Typography variant='body2' color='text.secondary'>
            Configure notification templates and settings (Not implemented in
            this demo)
          </Typography>
          <Divider sx={{ mb: 3 }} />

          <Box sx={{ p: 3, textAlign: "center" }}>
            <Typography variant='body1'>
              Notification settings will be implemented in a future update.
            </Typography>
          </Box>
        </Paper>
      )}

      {activeTab === 3 && (
        <Paper sx={{ p: 3 }}>
          <Typography variant='h6' gutterBottom>
            Security Settings
          </Typography>
          <Typography variant='body2' color='text.secondary'>
            Configure security and privacy settings (Not implemented in this
            demo)
          </Typography>
          <Divider sx={{ mb: 3 }} />

          <Box sx={{ p: 3, textAlign: "center" }}>
            <Typography variant='body1'>
              Security settings will be implemented in a future update.
            </Typography>
          </Box>
        </Paper>
      )}

      <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end" }}>
        <Button
          variant='contained'
          color='primary'
          onClick={handleSave}
          size='large'
        >
          Save Changes
        </Button>
      </Box>
    </Layout>
  );
};

export default SettingsPage;
