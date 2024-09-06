import React, { useEffect, useState } from "react";
import ReconnectingWebSocket from "reconnecting-websocket";

const WEBSOCKET_URL = "wss://blynk-cloud.com:8080/websockets";

const BLYNK_TOKEN = "FlzZ9b7m3MML40odKxvBECh6UPURMVg6";
const baseURL = "https://blr1.blynk.cloud/external/api/";

const Dash = () => {
  const [temperature, setTemperature] = useState(0);
  const [humidity, setHumidity] = useState(0);
  const [soilMoisture, setSoilMoisture] = useState(0);

  useEffect(() => {
    // Function to send HTTP request
    async function getHumidity() {
      const pin = "v1";
      try {
        const response = await fetch(
          `${baseURL}get?token=${BLYNK_TOKEN}&${pin}`
        ); // Replace with your API endpoint
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
        const response = await fetch(
          `${baseURL}get?token=${BLYNK_TOKEN}&${pin}`
        ); // Replace with your API endpoint
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
        const response = await fetch(
          `${baseURL}get?token=${BLYNK_TOKEN}&${pin}`
        ); // Replace with your API endpoint
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

    // Call sendRequest every second
    setInterval(getTemperature, 1000); // 1000 milliseconds = 1 second
    setInterval(getMoisture, 1000); // 1000 milliseconds = 1 second
    setInterval(getHumidity, 1000); // 1000 milliseconds = 1 second
  }, []);

  return (
    <div>
      <h1>Dash</h1>
      <p>Temperature: {temperature}°C</p>
      <p>Humidity: {humidity}%</p>
      <p>Soil Moisture: {soilMoisture}%</p>
    </div>
  );
};

export default Dash;
