import { useEffect, useState } from "react";
import {
  Container,
  Grid,
  Typography,
  Switch,
  Card,
  CardContent,
} from "@mui/material";

const BLYNK_TOKEN = "FlzZ9b7m3MML40odKxvBECh6UPURMVg6";
const BLYNK_BASE_URL = `https://blr1.blynk.cloud/external/api`;

const Dashboard = () => {
  const [temperature, setTemperature] = useState(0);
  const [humidity, setHumidity] = useState(0);
  const [soilMoisture, setSoilMoisture] = useState(0);
  const [motorState, setMotorState] = useState(false);
  const [switchState, setSwitchState] = useState(false);

  // Fetch sensor data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${BLYNK_BASE_URL}/get?token=${BLYNK_TOKEN}&v0`
        );
        const data = await response.json();
        setTemperature(data[0]); // Assuming v0 is temperature
        setHumidity(data[1]); // Assuming v1 is humidity
        setSoilMoisture(data[2]); // Assuming v2 is soil moisture
      } catch (error) {
        console.error("Error fetching sensor data:", error);
      }
    };
    fetchData();
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
              <Typography variant="h4">{temperature}°C</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">Humidity</Typography>
              <Typography variant="h4">{humidity}%</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">Soil Moisture</Typography>
              <Typography variant="h4">{soilMoisture}%</Typography>
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
