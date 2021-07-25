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
    const commentsCollection = client.db(`${process.env.DB_MYDATA}`).collection(`${process.env.DB_COMMENTS}`);
    const themesCollection = client.db(`${process.env.DB_MYDATA}`).collection(`${process.env.DB_THEMES}`);
    const ordersCollection = client.db(`${process.env.DB_MYDATA}`).collection(`${process.env.DB_ORDERS}`);
    const adminsCollection = client.db(`${process.env.DB_MYDATA}`).collection(`${process.env.DB_ADMINS}`);
    console.log("Mongodb database connect okay");

    // BLOGS ROUTES FUNCTIONS ----------------------------------------------------------------
    // POST blogs to MDB cloud:
    app.post('/addBlogs', (req, res) => {
        const newBlog = req.body;
        blogsCollection.insertOne(newBlog)
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

    // Patch/update to mongodb database: DashboardCode
    app.patch("/updateBlog/:id", (req, res) => {
        blogsCollection.updateOne(
            { _id: ObjectId(req.params.id) },
            {
                $set: {
                    title: req.body.title,
                    category: req.body.category,
                    author: req.body.author,
                    date: req.body.date,
                    image: req.body.image,
                    description: req.body.description,
                    topics: req.body.topics,
                    tags: req.body.tags,
                }
            })
            .then(result => {
                res.send(result.modifiedCount > 0);
            })
    })

    // Delete one blog from MDB cloud: DashboardCode
    app.delete('/deleteBlog/:id', (req, res) => {
        blogsCollection.deleteOne({ _id: ObjectId(req.params.id) })
            .then(result => {
                res.send(result.deletedCount > 0);
            })
    })

    // COMMENTS ROUTES FUNCTIONS ----------------------------------------------------------------
    // POST comment to MDB cloud:
    app.post('/addComments', (req, res) => {
        const newComment = req.body;
        commentsCollection.insertOne(newComment)
            .then(result => {
                res.send(result.insertedCount > 0)
            })
    })

    // GET specific blog comments (by blogID) from MDB cloud:
    app.get('/comments', (req, res) => {
        commentsCollection.find({})
            .toArray((err, comments) => {
                res.send(comments)
            })
    })


    // THEMES ROUTES FUNCTIONS ----------------------------------------------------------------
    // POST themes to mongodb cloud:
    app.post('/addThemes', (req, res) => {
        const newTheme = req.body;
        themesCollection.insertOne(newTheme)
            .then(result => {
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

    // Patch/update to mongodb database: DashboardCode
    app.patch("/updateTheme/:id", (req, res) => {
        themesCollection.updateOne(
            { _id: ObjectId(req.params.id) },
            {
                $set: {
                    name: req.body.name,
                    price: req.body.price,
                    category: req.body.category,
                    author: req.body.author,
                    date: req.body.date,
                    image: req.body.image,
                    detail: req.body.detail,
                    features: req.body.features,
                    version: req.body.version,
                    discount: req.body.discount,
                    brand: req.body.brand,
                }
            })
            .then(result => {
                res.send(result.modifiedCount > 0);
            })
    })

    // Delete one theme from MDB cloud: DashboardCode
    app.delete('/deleteTheme/:id', (req, res) => {
        themesCollection.deleteOne({ _id: ObjectId(req.params.id) })
            .then(result => {
                res.send(result.deletedCount > 0);
            })
    })

    // ORDERS ROUTES FUNCTIONS ----------------------------------------------------------------
    // POST orders to the MDB cloud:
    app.post('/addOrder', (req, res) => {
        const newOrder = req.body;
        ordersCollection.insertOne(newOrder)
            .then(result => {
                res.send(result.insertedCount > 0);
            })
    })

    // GET all orders from the MDB cloud:
    app.get('/orders', (req, res) => {
        ordersCollection.find({})
            .toArray((err, orders) => {
                res.send(orders)
            })
    })

    // ADMINS ROUTES FUNCTIONS ----------------------------------------------------------------
    // POST admins to the MDB cloud:
    app.post('/addAdmins', (req, res) => {
        const newAdmin = req.body;
        adminsCollection.insertOne(newAdmin)
            .then(result => {
                res.send(result.insertedCount > 0);
            })
    })

    // GET all admins from the MDB cloud:
    app.get('/admins', (req, res) => {
        adminsCollection.find({})
            .toArray((err, admins) => {
                res.send(admins)
            })
    })

    // Patch/update to mongodb database: DashboardCode
    app.patch("/update/:id", (req, res) => {
        productsCollection.updateOne(
            { _id: ObjectId(req.params.id) },
            {
                $set: {
                    name: req.body.name,
                    price: req.body.price,
                    group: req.body.group,
                    key: req.body.key,
                    seller: req.body.seller,
                    author: req.body.author,
                    category: req.body.category,
                    collection: req.body.collection,
                    date: req.body.date,
                }
            })
            .then(result => {
                // console.log(result);
                res.send(result.modifiedCount > 0);
            })
    })

    // Delete one product from MDB cloud: DashboardCode
    app.delete('/deleteDataOne/:id', (req, res) => {
        productsCollection.deleteOne({ _id: ObjectId(req.params.id) })
            .then(result => {
                // console.log(result);
                res.send(result.deletedCount > 0);
            })
    })






});
app.listen(port);
