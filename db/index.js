const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: './db/db.env' });



mongoose
    .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .catch(e => {
        console.error('Connection error', e.message)
    })

const db = mongoose.connection

module.exports = db