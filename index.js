const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const port = process.env.PORT || 5000;


//Middleware


app.use(cors());
app.use(express.json());







const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster-0.djotxke.mongodb.net/?retryWrites=true&w=majority&appName=Cluster-0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();

        const menuCollection = client.db("Center").collection("menu");
        const cartsCollection = client.db("Center").collection("carts");


        app.get('/menu', async (req, res) => {
            const result = await menuCollection.find().toArray();
            res.send(result);
        })

        app.get('/reviews', async (req, res) => {
            const result = await reviewsCollection.find().toArray();
            res.send(result);
        })

        //carts collections

        app.get ('/carts', async(req, res) =>{
            const email = req.query.email;
            const query = {email:email};
            const result = await cartsCollection.find(query).toArray();
            res.send(result);
        });

        app.post ('/carts', async (req,res) =>{
            const cartItem = req.body;
            const result = await cartsCollection.insertOne(cartItem);
            res.send(result);

        })






        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();




    }
}
run().catch(console.dir);




app.get('/', (req, res) => {
    res.send('server is running...3')
});


app.listen(port, () => {
    console.log(`server is running on port  ${port}`)
});


 /**
 * -------------------------------------
 * Naming convention
 * -------------------------------------
 * app.get ('/users')
 * app.get('/users/:id')
 * app.post('/users')
 * app.put('/users/:id')
 * app.patch('/users/:id')
 * app.delete('/users/:id')
 */



// Islamic - Center2