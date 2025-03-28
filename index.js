// backend/index.js
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());             // Enable CORS for all requests
app.use(express.json());     // Parse JSON request bodies

// GET /api/directory - returns the entire directory information
app.get('/api/directory', (req, res) => {
  const filePath = path.join(__dirname, 'Biology_Directory.json');
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to read directory data' });
    }
    const directoryData = JSON.parse(data);
    res.json(directoryData);
  });
});

// POST /api/directory - add a new entry to the directory
app.post('/api/directory', (req, res) => {
  const { category, entry } = req.body;  // Expecting category and entry object in request
  if (!category || !entry) {
    return res.status(400).json({ error: 'Category and entry data are required' });
  }
  const filePath = path.join(__dirname, 'Biology_Directory.json');
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to read directory data' });
    }
    const directoryData = JSON.parse(data);
    if (!directoryData[category]) {
      directoryData[category] = []; // create the category array if not exists
    }
    directoryData[category].push(entry);
    // Write the updated data back to the file
    fs.writeFile(filePath, JSON.stringify(directoryData, null, 2), (err) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to save new entry' });
      }
      res.json({ message: 'Entry added successfully', entry });
    });
  });
});

// GET /api/config - get the current welcome message and email list
app.get('/api/config', (req, res) => {
  const configPath = path.join(__dirname, 'config.json');
  fs.readFile(configPath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to read config' });
    }
    const config = JSON.parse(data);
    res.json(config);
  });
});

// POST /api/config - update welcome message and/or email recipients
app.post('/api/config', (req, res) => {
  const { welcomeMessage, helpRecipients } = req.body;
  const configPath = path.join(__dirname, 'config.json');
  fs.readFile(configPath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to read config' });
    }
    let config = JSON.parse(data);
    if (welcomeMessage !== undefined) config.welcomeMessage = welcomeMessage;
    if (helpRecipients !== undefined) config.helpRecipients = helpRecipients;
    fs.writeFile(configPath, JSON.stringify(config, null, 2), (err) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to update config' });
      }
      res.json({ message: 'Config updated', config });
    });
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`✅ Backend server is running on http://localhost:${PORT}`);
});
