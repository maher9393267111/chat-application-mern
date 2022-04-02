const mongoose = require('mongoose');
require("dotenv").config();
const databaseConnect = () => {
    mongoose
    .connect(process.env.MONGODB_URL, {
        useNewUrlParser: true,
        // useCreateIndex: true,
        // useUnifiedTopology: true
     
    })
    .then(() => console.log('DB Connected'));

 
}
module.exports = databaseConnect;