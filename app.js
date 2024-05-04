// app.js
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/user.routes');

const app = express();

app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/api/users', userRoutes);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
