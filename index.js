const express = require("express");
const mongoose = require("mongoose");
const dotenv = require('dotenv');

dotenv.config();


//Connect to DB
try {
    mongoose.connect(process.env.DB_CONNECT,
        { useNewUrlParser: true, useUnifiedTopology: true }
    );
    console.log("Connected to DB");
} catch (error) {
    console.error("Unable to connect to the Database");
}

// Import Routes
const authRoute = require('./routes/auth');
const postsRoute = require('./routes/posts');

const app = express();

app.use(express.json());

// Route middlewares
app.use('/api/user', authRoute);
app.use('/api/posts', postsRoute);


const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is up and running on ${PORT}`);
})