const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt-nodejs');
const knex = require('knex');

const db = knex({
  client: 'pg',
  connection: {
    host: '127.0.0.1',
    port: 5432,
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
  res.json(database);
});

// LOGIN
app.post('/login', (req, res) => {
  db.select('email', 'hash')
    .from('login')
    .where('email', '=', req.body.email)
    .then((data) => {
      const isValid = bcrypt.compareSync(req.body.password, data[0].hash);
      if (isValid) {
        return db
          .select('*')
          .from('users')
          .where('email', '=', req.body.email)
          .then((user) => {
            res.json(user[0]);
          });
      } else {
        res.status(400).json('Error Logging In');
      }
    })
    .catch((err) => {
      res.status(400).json('Error Logging In');
    })
    .catch((err) => res.status(400).json('Invalid Credentials'));
});

// REGISTER
app.post('/register', (req, res) => {
  const { email, name, password } = req.body;
  const hash = bcrypt.hashSync(password);
  db.transaction((trx) => {
    trx
      .insert({
        hash: hash,
        email: email,
      })
      .into('login')
      .returning('email')
      .then((loginEmail) => {
        return trx('users')
          .returning('*')
          .insert({
            name: name,
            email: loginEmail[0],
            joined: new Date(),
          })
          .then((user) => {
            res.json(user[0]);
          });
      })
      .then(trx.commit)
      .catch(trx.rollback);
  }).catch((err) => res.status(400).json('Unable to Register'));
});

// PROFILE
app.get('/profile/:id', (req, res) => {
  const { id } = req.params;
  let found = false;
  db.select('*')
    .from('users')
    .where({ id })
    .then((user) => {
      if (user.length) {
        res.json(user[0]);
      } else {
        res.status(404).json('User Not Found');
      }
    })
    .catch((err) => res.status(404).json('Error Retrieving Profile'));
});

// IMAGE
app.put('/image', (req, res) => {
  const { id } = req.body;
  let found = false;
  db('users')
    .where('id', '=', id)
    .increment('entries', 1)
    .returning('entries')
    .then((entries) => res.json(entries[0]))
    .catch((err) => {
      res.status(404).json('Error Retrieving Entries');
    });
});

app.listen(3000, () => {
  console.log('App is Running on Port 3000');
});
