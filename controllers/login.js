const handleLogin = (req, res, db, bcrypt) => {
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
};

module.exports = {
  handleLogin: handleLogin,
};
