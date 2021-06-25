const express = require('express')
const cors = require('cors');
// const fs = require('fs-extra');
// const fileUpload = require('express-fileupload');
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config()

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.tzaf0.mongodb.net/retro-blog?retryWrites=true&w=majority`;

const ObjectID = require('mongodb').ObjectID;
const app = express()

// app.use(express.static('services'));
// app.use(fileUpload());
const port = process.env.PORT || 5056;

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const blogCollection = client.db("retro-blog").collection("blogs");
    const adminCollection = client.db("retro-blog").collection("admin");
    console.log('db connected');

    app.post('/addBlogs', (req, res) => {
        const newReview = req.body;
        console.log(newReview);
        blogCollection.insertOne(newReview)
            .then(result => {
                console.log(result.insertedCount);
                res.send(result.insertedCount > 0)
            })
    })

    app.get('/blogs', (req, res) => {
        blogCollection.find()
            .toArray((err, items) => {
                res.send(items)
            })
    })

    app.get('/blogs/:_id', (req, res) => {
        blogCollection.find({ _id: ObjectID(req.params._id) })
            .toArray((err, documents) => {
                res.send(documents[0])
            })
    })

    app.get('/manageBlogs', (req, res) => {
        blogCollection.find()
            .toArray((err, items) => {
                res.send(items)
            })
    })

    app.delete('/deleteBlog/:id', (req, res) => {
        blogCollection.deleteOne({ _id: ObjectID(req.params.id) })
            .then(result => {
                res.send({ count: result.deletedCount > 0 });
                // res.redirect('/')
            })


    })

    app.post('/addAdmin', (req, res) => {
        const newAdmin = req.body;
        console.log(newAdmin);
        adminCollection.insertOne(newAdmin)
            .then(result => {
                console.log(result.insertedCount);
                res.send(result.insertedCount > 0)
            })
    })

    app.post('/isAdmin', (req, res) => {
        const email = req.body.email;
        const password = req.body.password;
        adminCollection.find({ email: email } && {password: password})
            .toArray((err, admin) => {
                res.send(admin.length > 0);
            })
    })

})