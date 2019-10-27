const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://root:Loreste123@cluster0-hzqd7.mongodb.net/test?retryWrites=true&w=majority', {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(db =>console.log('DB esta concetada'))
  .catch(err =>console.error(err));