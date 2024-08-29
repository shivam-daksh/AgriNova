const BLYNK_TOKEN = "FlzZ9b7m3MML40odKxvBECh6UPURMVg6";
const BLYNK_BASE_URL = `https://blr1.blynk.cloud/external/api`;

// Function to get sensor data
async function getSensorData() {
    try {
        const response = await fetch(`${BLYNK_BASE_URL}/get?token=${BLYNK_TOKEN}&v0`);
        const data = await response.json();
        console.log("Sensor Data:", data);
        return data;
    } catch (error) {
        console.error("Error fetching sensor data:", error);
    }
}

// Function to control motor
async function controlMotor(state) {
    try {
        const url = `${BLYNK_BASE_URL}/update?token=${BLYNK_TOKEN}&v1=${state ? 1 : 0}`;
        const response = await fetch(url, { method: 'GET' });
        console.log("Motor Control Response:", await response.text());
    } catch (error) {
        console.error("Error controlling motor:", error);
    }
}

// Function to control switch
async function controlSwitch(state) {
    try {
        const url = `${BLYNK_BASE_URL}/update?token=${BLYNK_TOKEN}&v2=${state ? 1 : 0}`;
        const response = await fetch(url, { method: 'GET' });
        console.log("Switch Control Response:", await response.text());
    } catch (error) {
        console.error("Error controlling switch:", error);
    }
}

// Example usage
getSensorData();          // Fetch and log sensor data
controlMotor(true);       // Turn on the motor
controlSwitch(false);     // Turn off the switch
