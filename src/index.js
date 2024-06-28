// Import required modules
const express = require('express');
const path = require('path');
const db = require('./db'); // Import the database connection

// Create an Express application
const app = express();

// Define the path to the public folder
const publicPath = path.join(__dirname, 'public');

// Middleware to serve static files
app.use(express.static(publicPath));

// Route to handle server detail pages
app.get('/servers/:serverName', (req, res) => {
    const serverName = req.params.serverName;

    db.query('SELECT * FROM servers WHERE name = ?', [serverName], (error, results) => {
        if (error) {
            console.error('Error fetching data from database:', error);
            return res.status(500).send('Internal Server Error');
        }

        if (results.length === 0) {
            return res.status(404).send('Server not found');
        }

        const server = results[0];
        // Assuming server-page.html will handle displaying the server details
        res.sendFile(path.join(__dirname, 'public', '/server-page/server-page.html'));
    });
});

// Route to handle server detail pages
app.get('/getserver/:serverName', (req, res) => {
  const serverName = req.params.serverName;

  db.query('SELECT * FROM servers WHERE name = ?', [serverName], (error, results) => {
      if (error) {
          console.error('Error fetching data from database:', error);
          return res.status(500).send('Internal Server Error');
      }

      if (results.length === 0) {
          return res.status(404).send('Server not found');
      }

      const server = results[0];
      // Assuming server-page.html will handle displaying the server details
      res.json(server);
  });
});

// Route to handle getting all servers' data
app.get('/getservers', (req, res) => {
    db.query('SELECT * FROM servers', (error, results) => {
        if (error) {
            console.error('Error fetching data from database:', error);
            return res.status(500).send('Internal Server Error');
        }

        if (results.length === 0) {
            return res.status(404).send('There are no servers');
        }

        res.json(results);
    });
});

// Define the port number
const port = 3000;

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
