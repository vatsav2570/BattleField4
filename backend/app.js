require('dotenv').config();

const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT;

// Replace with your MongoDB Atlas connection string
const mongoURI = process.env.MONGODB_URI;

// Connect to MongoDB using Mongoose
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB Atlas connected'))
.catch(err => console.error('MongoDB Atlas connection error:', err));

// Enable CORS if needed for your React app
app.use(cors());

// Use body-parser middleware to parse JSON request bodies
app.use(bodyParser.json());

// Define the session data schema
const sessionSchema = new mongoose.Schema({
  sessionId: { type: String, required: true },
  numPlayers: { type: Number, required: true },
  ping: { type: Number, required: true },
  tickrate: { type: Number, required: true },
  settingsLabel: { type: Array, required: true },
  advancedLabel: { type: Array, required: true },
  rulesLabel: { type: Array, required: true },
});

const Session = mongoose.model('Session', sessionSchema);

// API endpoint to create a new session
app.post('/api/sessions', async (req, res) => {
  const { sessionId, numPlayers, ping, tickrate, settingsLabel, advancedLabel, rulesLabel } = req.body;
  try {
    const newSession = new Session({ sessionId, numPlayers, ping, tickrate, settingsLabel, advancedLabel, rulesLabel });
    await newSession.save();
    res.json({ message: 'Session created successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error creating session' });
  }
});

// API endpoint to retrieve a session by ID
app.get('/api/sessions/:sessionId', async (req, res) => {
  const sessionId = req.params.sessionId;
  try {
    const session = await Session.findById(sessionId);
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }
    res.json(session);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error retrieving session' });
  }
});

const _dirname = path.dirname("");
const buildpath = path.join(_dirname, "./battlefield4/build");
app.use(express.static(buildpath));

// Start the server
app.listen(port, () => console.log(`Server listening on port ${port}`));
