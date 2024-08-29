import React, { useEffect, useState } from "react";
import {
  Container,
  Grid,
  Typography,
  Switch,
  Card,
  CardContent,
} from "@mui/material";
import ReconnectingWebSocket from "reconnecting-websocket";

const BLYNK_TOKEN = "FlzZ9b7m3MML40odKxvBECh6UPURMVg6";
const BLYNK_BASE_URL = `https://blr1.blynk.cloud/external/api`;
const WEBSOCKET_URL = "ws://blynk-cloud.com:8080/websockets";

// Function to get the last sensor data from the Blynk server
//https://blr1.blynk.cloud/external/api/get?token=FlzZ9b7m3MML40odKxvBECh6UPURMVg6&v3
async function getSensorData(pin = "v3") {
  try {
    const response = await fetch(`
      ${BLYNK_BASE_URL}/get?token=${BLYNK_TOKEN}&${pin}
    `);
    const data = await response.json();
    console.log("Sensor Data:", data);
    return data;
  } catch (error) {
    console.error("Error fetching sensor data:", error);
  }
}
async function updateData(pin = "v3", value) {
  try {
    const response = await fetch(`
      ${BLYNK_BASE_URL}/update?token=${BLYNK_TOKEN}&${pin}= ${value}
    `);
    console.log(response);
    const data = await response.json();
    console.log("Sensor Data:", data);
    return data;
  } catch (error) {
    console.error("Error fetching sensor data:", error);
  }
}
getSensorData("v0");
updateData("v12", 1);

const Dashboard = () => {
  const [temperature, setTemperature] = useState(0);
  const [humidity, setHumidity] = useState(0);
  const [soilMoisture, setSoilMoisture] = useState(0);
  const [motorState, setMotorState] = useState(false);
  const [switchState, setSwitchState] = useState(false);
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    // Fetch the last sensor data on component mount
    getSensorData().then((data) => {
      setTemperature(data.temperature || 0);
      setHumidity(data.humidity || 0);
      setSoilMoisture(data.soilMoisture || 0);
    });

    // Initialize WebSocket
    const socket = new ReconnectingWebSocket(WEBSOCKET_URL);

    // Handle WebSocket events
    socket.addEventListener("open", () => {
      setIsOnline(true);
    });

    socket.addEventListener("close", () => {
      setIsOnline(false);
    });

    socket.addEventListener("message", (event) => {
      const { type, data } = JSON.parse(event.data);
      if (type === "temperature") {
        setTemperature(data);
      } else if (type === "humidity") {
        setHumidity(data);
      } else if (type === "soilMoisture") {
        setSoilMoisture(data);
      }
    });

    return () => {
      socket.close(); // Clean up WebSocket connection on component unmount
    };
  }, []);

  // Function to control motor
  const handleMotorChange = async () => {
    try {
      const newState = !motorState;
      setMotorState(newState);
      const url = `${BLYNK_BASE_URL}/update?token=${BLYNK_TOKEN}&v1=${
        newState ? 1 : 0
      }`;
      await fetch(url, { method: "GET" });
    } catch (error) {
      console.error("Error controlling motor:", error);
    }
  };

  // Function to control switch
  const handleSwitchChange = async () => {
    try {
      const newState = !switchState;
      setSwitchState(newState);
      const url = `${BLYNK_BASE_URL}/update?token=${BLYNK_TOKEN}&v2=${
        newState ? 1 : 0
      }`;
      await fetch(url, { method: "GET" });
    } catch (error) {
      console.error("Error controlling switch:", error);
    }
  };

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
