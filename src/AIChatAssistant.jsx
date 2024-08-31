import React, { useState } from "react";
import {
  Container,
  Box,
  Grid,
  Paper,
  Typography,
  TextField,
  IconButton,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Drawer,
} from "@mui/material";
import {
  Send as SendIcon,
  Menu as MenuIcon,
  Settings as SettingsIcon,
} from "@mui/icons-material";

const AIChatAssistant = () => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleSend = () => {
    if (inputValue.trim()) {
      setMessages([...messages, { text: inputValue, type: "user" }]);
      setInputValue("");
      // Mock response from AI Assistant
      setTimeout(() => {
        setMessages((prevMessages) => [
          ...prevMessages,
          { text: "This is a response from the AI assistant.", type: "bot" },
        ]);
      }, 1000);
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
                <Typography variant="h5">AI Assistant</Typography>
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
                          message.type === "user" ? "#1976d2" : "#f5f5f5",
                        color: message.type === "user" ? "white" : "black",
                      }}
                    >
                      {message.text}
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
