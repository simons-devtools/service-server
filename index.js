const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');
const ObjectId = require('mongodb').ObjectID;
const { MongoClient } = require('mongodb');
const admin = require("firebase-admin");
require('dotenv').config();
const port = process.env.PORT || 5000;

// Mongodb connection:
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.xgsrn.mongodb.net/${process.env.DB_MYDATA}?retryWrites=true&w=majority`;
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
    const blogsCollection = client.db(`${process.env.DB_MYDATA}`).collection(`${process.env.DB_BLOGS}`);
    const themesCollection = client.db(`${process.env.DB_MYDATA}`).collection(`${process.env.DB_THEMES}`);
    const ordersCollection = client.db(`${process.env.DB_MYDATA}`).collection(`${process.env.DB_ORDERS}`);
    console.log("Mongodb database connect okay");

    // BLOGS ROUTES FUNCTIONS ----------------------------------------------------------------
    app.post('/addBlogs', (req, res) => {
        const newBlogs = req.body;
        blogsCollection.insertOne(newBlogs)
            .then(result => {
                res.send(result.insertedCount > 0)
            })
    })

    // GET all blogs from MDB cloud:
    app.get('/blogs', (req, res) => {
        blogsCollection.find({})
            .toArray((err, blogs) => {
                res.send(blogs)
            })
    })

    // GET same package blog (by topics) from MDB cloud:
    app.get('/bloggers/:topics', (req, res) => {
        blogsCollection.find({ "topics": req.params.topics })
            .toArray((err, result) => {
                res.send(result)
            })
    })

    // GET single blog (by _id) from MDB cloud:
    app.get('/blog-single/:id', (req, res) => {
        blogsCollection.find({ "_id": ObjectId(req.params.id) })
            .toArray((err, result) => {
                res.send(result[0])
            })
    })

    // THEMES ROUTES FUNCTIONS ----------------------------------------------------------------
    // POST thems to mongodb cloud:
    app.post('/addThemes', (req, res) => {
        const newThemes = req.body;
        themesCollection.insertOne(newThemes)
            .then(result => {
                // console.log('Result=', result);
                res.send(result.insertedCount > 0)
            })
    })

    // GET all themes from MDB cloud:
    app.get('/themes', (req, res) => {
        themesCollection.find({})
            .toArray((err, themes) => {
                res.send(themes)
            })
    })

    // ORDERS ROUTES FUNCTIONS ----------------------------------------------------------------
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
