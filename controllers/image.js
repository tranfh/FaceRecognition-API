const Clarifai = require('clarifai');

const app = new Clarifai.App({
  apiKey: '7c2f80f017164bc6b99de474dd90e686',
});

const handleApiCall = (req, res) => {
  app.models
    .predict(Clarifai.FACE_DETECT_MODEL, req.body.input)
    .then((data) => {
      res.json(data);
    })
    .catch((err) => res.status(400).json('Unable to Work with API'));
};

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
  handleApiCall: handleApiCall,
};
