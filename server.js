const express = require('express');
const cors = require('cors');

const app = express();

const database = {
  users: [
    {
      id: '123',
      name: 'Frank',
      email: 'test',
      password: 'test',
      entries: 0,
      joined: new Date(),
    },
    {
      id: '124',
      name: 'Ricky',
      email: 'ricky@gmail.com',
      password: 'abc123',
      entries: 0,
      joined: new Date(),
    },
  ],
};

app.use(express.json());
app.use(cors());

// HELPER FN

// HOME
app.get('/', (req, res) => {
  res.json(database);
});

// LOGIN
app.post('/login', (req, res) => {
  console.log(req.body);
  if (
    req.body.email === database.users[0].email &&
    req.body.password === database.users[0].password
  ) {
    res.json(database.users[0]);
  } else {
    res.status(400).json('Error Logging In');
  }
  res.json('Login is working');
});

// REGISTER
app.post('/register', (req, res) => {
  const { email, name, password } = req.body;
  database.users.push({
    id: '125',
    name: name,
    email: email,
    password: password,
    entries: 0,
    joined: new Date(),
  });
  console.log(database);
  res.json(database.users[database.users.length - 1]);
});

// PROFILE
app.get('/profile/:id', (req, res) => {
  const { id } = req.params;
  let found = false;
  database.users.forEach((user) => {
    if (user.id === id) {
      found = true;
      return res.json(user);
    }
  });
  if (!found) {
    res.status(404).json('User Not Found');
  }
});

// IMAGE
app.put('/image', (req, res) => {
  const { id } = req.body;
  let found = false;
  database.users.forEach((user) => {
    if (user.id === id) {
      found = true;
      user.entries++;
      return res.json(user.entries);
    }
  });
  if (!found) {
    res.status(404).json('User Not Found');
  }
});

app.listen(3000, () => {
  console.log('App is Running on Port 3000');
});
