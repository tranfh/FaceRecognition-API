const handleProfile = (req, res, db) => {
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
};

module.export = {
  handleProfile: handleProfile,
};
