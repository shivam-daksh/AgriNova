import React, { useEffect, useState } from "react";
import {
  Container,
  Grid,
  Typography,
  Switch,
  Card,
  CardContent,
} from "@mui/material";

const BLYNK_TOKEN = "FlzZ9b7m3MML40odKxvBECh6UPURMVg6";
const baseURL = "https://blr1.blynk.cloud/external/api/";

const Dashboard = () => {
  const [temperature, setTemperature] = useState(0);
  const [humidity, setHumidity] = useState(0);
  const [soilMoisture, setSoilMoisture] = useState(0);
  const [motorState, setMotorState] = useState(false);
  const [switchState, setSwitchState] = useState(false);
  const [isOnline, setIsOnline] = useState(true);

  async function isHardwareOnline() {
    try {
      const response = await fetch(
        `${baseURL}isHardwareConnected?token=${BLYNK_TOKEN}`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      console.log("Data received:", data);
      setIsOnline(data);
      return data;
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
    }
  }

  async function getHumidity() {
    const pin = "v1";
    try {
      const response = await fetch(`${baseURL}get?token=${BLYNK_TOKEN}&${pin}`); // Replace with your API endpoint
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      console.log("Data received:", data);
      setHumidity(data);
      return data;
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
    }
  }

  async function getTemperature() {
    const pin = "v0";
    try {
      const response = await fetch(`${baseURL}get?token=${BLYNK_TOKEN}&${pin}`); // Replace with your API endpoint
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      console.log("Data received:", data);
      setTemperature(data);
      return data;
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
    }
  }

  async function getMoisture() {
    const pin = "v3";
    try {
      const response = await fetch(`${baseURL}get?token=${BLYNK_TOKEN}&${pin}`); // Replace with your API endpoint
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      console.log("Data received:", data);
      setSoilMoisture(data);
      return data;
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
    }
  }

  const handleMotorChange = async () => {
    try {
      const newState = !motorState;
      setMotorState(newState);
      const url = `${baseURL}update?token=${BLYNK_TOKEN}&v12=${
        !newState ? 1 : 0
      }`;
      fetch(url, { method: "GET" });
    } catch (error) {
      console.error("Error controlling motor:", error);
    }
  };

  // Function to control switch
  const handleSwitchChange = async () => {
    try {
      const newState = !switchState;
      setSwitchState(newState);
      const url = `${baseURL}update?token=${BLYNK_TOKEN}&v13=${
        !newState ? 1 : 0
      }`;
      await fetch(url, { method: "GET" });
    } catch (error) {
      console.error("Error controlling switch:", error);
    }
  };

  useEffect(() => {
    const intervalId1 = setInterval(isHardwareOnline, 100000); // 1000 milliseconds = 1 second
    const intervalId2 = setInterval(getTemperature, 1000); // 1000 milliseconds = 1 second
    const intervalId3 = setInterval(getMoisture, 1000); // 1000 milliseconds = 1 second
    const intervalId4 = setInterval(getHumidity, 1000); // 1000 milliseconds = 1 second

    return () => {
      clearInterval(intervalId1);
      clearInterval(intervalId2);
      clearInterval(intervalId3);
      clearInterval(intervalId4);
    };
  }, []);

  // Function to control motor

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        AgriNova Dashboard
      </Typography>
      <Grid container spacing={4}>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">Temperature</Typography>
              <Typography variant="h4">
                {isOnline ? temperature : "Fetching..."}°C
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">Humidity</Typography>
              <Typography variant="h4">
                {isOnline ? humidity : "Fetching..."}%
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">Soil Moisture</Typography>
              <Typography variant="h4">
                {isOnline ? soilMoisture : "Fetching..."}%
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Card>
            <CardContent>
              <Typography variant="h6">Motor</Typography>
              <Switch checked={motorState} onChange={handleMotorChange} />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Card>
            <CardContent>
              <Typography variant="h6">Switch</Typography>
              <Switch checked={switchState} onChange={handleSwitchChange} />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;
