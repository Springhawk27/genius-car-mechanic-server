// step 1 = require or import express
const express = require('express');
// step 6 - require mongodb
const { MongoClient } = require('mongodb');
// step 11 for objectid single service
const ObjectId = require('mongodb').ObjectId;
// step 6 or do it after getting error hehe(post api)
const cors = require('cors')

// step 8 - install dotenv to secure user and pass
// step 9 - require dotenv
require('dotenv').config()
// step 10 - create a .env file



// step 2 - create an app and call express
const app = express();

// step 2 - declare or set  a port
const port = 5000;

// step 6
// middleware
app.use(cors());
app.use(express.json());

// step 7 - connection to mongodb server 
// step 11 - set username and pass
// const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.42wwv.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.42wwv.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
// const uri = `mongodb+srv://geniuscar:JwJKL60VJDnU1yDh@cluster0.42wwv.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
// console.log(uri);

// step 7
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// step 12 -
async function run() {
    try {

        await client.connect();
        // console.log('connected to database');

        // database creation if theres none
        const database = client.db('carMechanic');
        // collection or simply a table
        const servicesCollection = database.collection('services');


        // GET API -  all services
        app.get('/services', async (req, res) => {
            const cursor = servicesCollection.find({});
            const services = await cursor.toArray();
            res.send(services);
        });

        // GET API - single service
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            // console.log('getting a specific id', id)
            const query = { _id: ObjectId(id) };
            const service = await servicesCollection.findOne(query);
            res.json(service)
        })



        // POST API -- services will be added(new)
        app.post('/services', async (req, res) => {

            const service = req.body;

            // console it to the terminal
            console.log("hit the post api", service)
            // data hardcoded
            // const service = {
            //     "name": "ENGINE DIAGNOSTIC",
            //     "price": "300",
            //     "description": "Lorem ipsum dolor sit amet, consectetu radipisi cing elitBeatae autem aperiam nequ quaera molestias voluptatibus harum ametipsa.",
            //     "img": "https://i.ibb.co/dGDkr4v/1.jpg"
            // }
            // insertion of one data
            const result = await servicesCollection.insertOne(service);
            console.log(result);

            // sending the data
            // res.send('post hitted')
            res.json(result)

        });

        // DELETE API
        app.delete('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await servicesCollection.deleteOne(query);
            res.json(result);

        })
    }
    finally {
        // await client.close();
    }

}
//step 12.1 - must call the function or it wont work
run().catch(console.dir);


// step 4 - set a default route or api link to check wheter its working fine or not
app.get('/', (req, res) => {
    // req can give - params, query, data in body, headers
    // res can send - string vice versa, if not get then we must do res.json()

    res.send('Running Genius Server')
})

// step 5 - app should listen a port - define which port and then a callback func
app.listen(port, () => {
    console.log('Running genius server on port:', port)

})