#define BLYNK_TEMPLATE_ID "TMPL3U4q9GX22"
#define BLYNK_TEMPLATE_NAME "AgriNova"
#define BLYNK_AUTH_TOKEN "FlzZ9b7m3MML40odKxvBECh6UPURMVg6"

#include <ESP8266WiFi.h>
#include <BlynkSimpleEsp8266.h>
#include <DHT.h>

char auth[] = "FlzZ9b7m3MML40odKxvBECh6UPURMVg6";
char ssid[] = "A-BLOCK";
char pass[] = "welcome$ABH";

DHT dht(D4, DHT11);
BlynkTimer timer;

#define soil A0
#define RELAY_PIN_1 D3
// #define PIR D5

// int PIR_ToggleValue;
int relay1State = LOW;
bool autoMode = true; // true for auto mode, false for manual mode

void setup() {
  Serial.begin(9600);
  pinMode(soil, INPUT);
  pinMode(RELAY_PIN_1, OUTPUT);
  // pinMode(PIR, INPUT);
  
  digitalWrite(RELAY_PIN_1, LOW);  // Keep the motor off initially

  Blynk.begin(auth, ssid, pass);
  dht.begin();

  timer.setInterval(1000L, soilMoistureSensor);
  timer.setInterval(1000L, DHT11sensor);
  // timer.setInterval(1000L, checkPIR);
}

void DHT11sensor() {
  float h = dht.readHumidity();
  float t = dht.readTemperature();

  if (isnan(h) || isnan(t)) {
    Serial.println("Failed to read from DHT sensor!");
    return;
  }
  
  Blynk.virtualWrite(V0, t);
  Blynk.virtualWrite(V1, h);
}

void soilMoistureSensor() {
  int value = analogRead(soil);
  value = map(value, 0, 1024, 0, 100);
  value = (value - 100) * -1;

  Blynk.virtualWrite(V3, value);

  if (autoMode) {  // Only control motor automatically if in auto mode
    if (value < 25) {  // Soil is dry, turn on the motor
      digitalWrite(RELAY_PIN_1, LOW);
      relay1State = LOW;
    } else if (value > 40) {  // Soil has enough moisture, turn off the motor
      digitalWrite(RELAY_PIN_1, HIGH);
      relay1State = HIGH;
    }
    Blynk.virtualWrite(V12, relay1State);
  }
}

// void checkPIR() {
//   bool motionDetected = digitalRead(PIR);
//   if (motionDetected) {
//     Blynk.logEvent("pirdetection", "WARNING! Motion Detected!");
//   }
// }

BLYNK_WRITE(V12) {
  if (!autoMode) {  // Only allow manual control in manual mode
    relay1State = param.asInt();
    digitalWrite(RELAY_PIN_1, relay1State);
  }
}

BLYNK_WRITE(V13) {  // This pin controls auto/manual mode switch
  autoMode = param.asInt();
}

void loop() {
  Blynk.run();
  timer.run();
}
