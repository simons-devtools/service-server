const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');
// const ObjectId = require('mongodb').ObjectID;
const { MongoClient } = require('mongodb');
const admin = require("firebase-admin");
require('dotenv').config();
const port = process.env.PORT || 5000;

// Mongodb connection:
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.xgsrn.mongodb.net/${process.env.DB_BLOGS}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// Google service account:
const serviceAccount = require("./configs/domainamex-firebase-adminsdk-bymxj-45a863d756.json");
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});


// Call the all packages:
const app = express()
app.use(bodyParser.json());
app.use(cors());

// Root url:
app.get('/', (req, res) => {
    res.send("Hello domainamex-server, I'm ready for work.");
})

// Connect mongodb collection:
client.connect(err => {
    const blogsCollection = client.db(`${process.env.DB_BLOGS}`).collection(`${process.env.DB_BLOG}`);
    console.log("Mongodb database connect okay");

    // CRUD collection code ..... 
    // .....
});



app.listen(port);
