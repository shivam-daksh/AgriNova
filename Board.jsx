import React, { useEffect, useState } from "react";
import ReconnectingWebSocket from "reconnecting-websocket";

const WEBSOCKET_URL = "wss://blynk-cloud.com:8080/websockets";
const BLYNK_TOKEN = "YourAuthToken";

const Dash = () => {
  const [temperature, setTemperature] = useState(0);
  const [humidity, setHumidity] = useState(0);
  const [soilMoisture, setSoilMoisture] = useState(0);

  useEffect(() => {
    const socket = new ReconnectingWebSocket(WEBSOCKET_URL);

    // Listen for WebSocket events
    socket.addEventListener("open", () => {
      console.log("WebSocket connection established");
    });

    socket.addEventListener("message", (event) => {
      const message = JSON.parse(event.data);
      // Handle different types of messages
      if (message.type === "temperature") {
        setTemperature(message.data);
      } else if (message.type === "humidity") {
        setHumidity(message.data);
      } else if (message.type === "soilMoisture") {
        setSoilMoisture(message.data);
      }
    });

    socket.addEventListener("close", () => {
      console.log("WebSocket connection closed");
    });

    return () => {
      socket.close();
    };
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
