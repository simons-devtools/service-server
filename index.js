const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');
const ObjectId = require('mongodb').ObjectID;
const { MongoClient } = require('mongodb');
const admin = require("firebase-admin");
require('dotenv').config();
const port = process.env.PORT || 5000;

// Mongodb connection:
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.xgsrn.mongodb.net/${process.env.DB_ECOMMERCE}?retryWrites=true&w=majority`;
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
    const ordersCollection = client.db(`${process.env.DB_ECOMMERCE}`).collection(`${process.env.DB_ORDERS}`);
    console.log("Mongodb database connect okay");

    // Post order to the MDB cloud:
    app.post('/addOrder', (req, res) => {
        const newOrder = req.body;
        ordersCollection.insertOne(newOrder)
            .then(result => {
                res.send(result.insertedCount > 0);
            })
    })
});



app.listen(port);
