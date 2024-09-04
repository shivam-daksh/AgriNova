import { useState } from "react";
import {
  Container,
  Box,
  Grid,
  Paper,
  Typography,
  TextField,
  IconButton,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import MenuIcon from "@mui/icons-material/Menu";
import SettingsIcon from "@mui/icons-material/Settings";
// import { configDotenv } from "dotenv";
// configDotenv();

// Your API key and endpoint
const API_KEY = "";
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${API_KEY}`;
function renderAIResponse(responseText) {
  // Utility function to parse and transform the response text
  const parseResponse = (text) => {
    // Split the text into lines
    const lines = text.split("\n");

    // Process each line
    return lines.map((line, index) => {
      // Transform bold text
      const boldLine = line.replace(
        /\*\*(.*?)\*\*/g,
        (match, p1) => `<strong>${p1}</strong>`
      );

      // Transform bullet points
      if (boldLine.trim().startsWith("* ")) {
        return (
          <li
            key={index}
            dangerouslySetInnerHTML={{ __html: boldLine.replace("* ", "") }}
          />
        );
      }

      return <p key={index} dangerouslySetInnerHTML={{ __html: boldLine }} />;
    });
  };

  return (
    <div
      style={{
        padding: "16px",
        backgroundColor: "#f5f5f5",
        borderRadius: "8px",
      }}
    >
      {parseResponse(responseText)}
    </div>
  );
}
const AIChatAssistant = () => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleSend = async () => {
    if (inputValue.trim()) {
      // Add user's message to the chat
      setMessages([...messages, { text: inputValue, type: "user" }]);

      // Prepare the request body
      const requestBody = {
        contents: [
          {
            parts: [
              {
                text: inputValue,
              },
            ],
          },
        ],
      };

      try {
        // Send the request to the API
        const response = await fetch(API_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        });

        // Parse the response
        const data = await response.json();

        // Assuming the response contains the AI-generated text
        // const aiResponse = data.contents[0].parts[0].text;
        console.log(data.candidates[0].content.parts[0].text);
        const aiResponse = data.candidates[0].content.parts[0].text;

        // Add AI's response to the chat
        setMessages((prevMessages) => [
          ...prevMessages,
          { text: aiResponse, type: "bot" },
        ]);
      } catch (error) {
        console.error("Error communicating with the AI API:", error);
        // Handle error (e.g., show a message to the user)
        setMessages((prevMessages) => [
          ...prevMessages,
          { text: "Error: Unable to get a response from the AI.", type: "bot" },
        ]);
      }

      // Clear the input field
      setInputValue("");
    }
  };

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  return (
    <Container
      maxWidth="md"
      sx={{ height: "100vh", display: "flex", flexDirection: "column" }}
    >
      <Box sx={{ flexGrow: 1, overflow: "hidden" }}>
        <Paper elevation={3} sx={{ height: "100%", padding: 2 }}>
          <Grid container spacing={2} sx={{ height: "100%" }}>
            <Grid item xs={12}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <IconButton onClick={toggleDrawer}>
                  <MenuIcon />
                </IconButton>
                <Typography variant="h5">AgriNova AI</Typography>
                <IconButton onClick={toggleDrawer}>
                  <SettingsIcon />
                </IconButton>
              </Box>
            </Grid>
            <Grid
              item
              xs={12}
              sx={{ flexGrow: 1, overflowY: "auto", maxHeight: "75vh" }}
            >
              <Box sx={{ padding: 2 }}>
                {messages.map((message, index) => (
                  <Box
                    key={index}
                    sx={{
                      textAlign: message.type === "user" ? "right" : "left",
                      marginBottom: 2,
                    }}
                  >
                    <Paper
                      sx={{
                        display: "inline-block",
                        padding: 1,
                        backgroundColor:
                          message.type === "user" ? "#f1f1f1" : "white",
                        color: message.type === "user" ? "black" : "black",
                      }}
                    >
                      {renderAIResponse(message.text)}
                    </Paper>
                  </Box>
                ))}
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Divider />
              <Box sx={{ display: "flex", padding: 1 }}>
                <TextField
                  fullWidth
                  sx={{ color: "black" }}
                  variant="outlined"
                  placeholder="Ask me anything..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      handleSend();
                    }
                  }}
                />
                <IconButton color="primary" onClick={handleSend}>
                  <SendIcon />
                </IconButton>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Box>
      <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer}>
        <Box sx={{ width: 250 }}>
          <Typography variant="h6" sx={{ padding: 2 }}>
            Settings
          </Typography>
          <Divider />
          <List>
            <ListItem button>
              <ListItemIcon>
                <SettingsIcon />
              </ListItemIcon>
              <ListItemText primary="General Settings" />
            </ListItem>
            {/* Add more settings options here */}
          </List>
        </Box>
      </Drawer>
    </Container>
  );
};

export default AIChatAssistant;
