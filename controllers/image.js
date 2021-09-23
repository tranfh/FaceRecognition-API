const handleImage = (req, res, db) => {
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
};
module.exports = {
  handleImage: handleImage,
};
