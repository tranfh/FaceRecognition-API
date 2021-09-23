const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt-nodejs');
const knex = require('knex');
const register = require('./controllers/register');
const login = require('./controllers/login');
const profile = require('./controllers/profile');
const image = require('./controllers/image');

const db = knex({
  client: 'pg',
  connection: {
    host: 'postgresql-defined-02431',
    user: 'franktran',
    password: '',
    database: 'smart-brain',
  },
});

// Test Connection
// console.log(db.select('*').from('users'));

const app = express();
app.use(express.json());
app.use(cors());

// HELPER FN

// HOME
app.get('/', (req, res) => {
  res.json('Launching Application...');
});

// LOGIN
app.post('/login', (req, res) => {
  login.handleLogin(req, res, db, bcrypt);
});

// REGISTER
app.post('/register', (req, res) => {
  register.handleRegister(req, res, db, bcrypt);
});

// PROFILE
app.get('/profile/:id', (req, res) => {
  profile.handleProfile(req, res, db);
});

// IMAGE
app.put('/image', (req, res) => {
  image.handleImage(req, res, db);
});
app.post('/imageurl', (req, res) => {
  image.handleApiCall(req, res);
});

const PORT = process.env.PORT;
app.listen(PORT || 3000, () => {
  console.log(`App is Running on ${PORT}`);
});
