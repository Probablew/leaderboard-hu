const express = require('express');
const path = require('path');
const db = require('./db'); // Assuming this file handles database connection
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const session = require('express-session');

const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Session configuration
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } // Set secure to true if using HTTPS
}));

// Static files
const publicPath = path.join(__dirname, 'public');
app.use(express.static(publicPath));

// Authentication middleware
function authenticateUser(req, res, next) {
    if (req.session.user) {
        next(); // Proceed to the next middleware or route handler
    } else {
        res.redirect('/login'); // Redirect to login page if not authenticated
    }
}

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

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(publicPath, 'index.html'));
});

app.get('/register', (req, res) => {
    res.sendFile(path.join(publicPath, 'register/register.html'));
});

app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).send('Username and password are required');
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        db.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashedPassword], (error, results) => {
            if (error) {
                console.error('Error inserting data into database:', error);
                return res.status(500).send('Internal Server Error');
            }
            res.status(201).send('User registered successfully');
        });
    } catch (error) {
        console.error('Error hashing password:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(publicPath, 'login/login.html'));
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).send('Username and password are required');
    }

    db.query('SELECT * FROM users WHERE username = ?', [username], async (error, results) => {
        if (error) {
            console.error('Error fetching data from database:', error);
            return res.status(500).send('Internal Server Error');
        }

        if (results.length === 0) {
            return res.status(400).send('Invalid username or password');
        }

        const user = results[0];
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(400).send('Invalid username or password');
        }

        req.session.user = user;
        res.redirect('/dashboard');
    });
});

app.get('/dashboard', authenticateUser, (req, res) => {
    res.sendFile(path.join(publicPath, 'dashboard/dashboard.html'));
});

app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Error destroying session:', err);
        }
        res.redirect('/');
    });
});

// Start server
const port = 3000;
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});