const mongoose = require('mongoose');

function database() {
    mongoose.connect(process.env.MONGO_URI)
      .then(() => console.log("Database connected!!"))
      .catch((err) => console.log(err));
}

module.exports = database