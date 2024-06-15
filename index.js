const express = require('express');

const app = express();
const cors = require('cors');
require('dotenv').config();
const port = process.env.PORT || 5000;


//Middleware


app.use(cors());
app.use(express.json());







const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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

        const userCollection = client.db("Center").collection("users");
        const menuCollection = client.db("Center").collection("menu");
        const cartsCollection = client.db("Center").collection("carts");
        const reviewsCollection = client.db("Center").collection("reviews");


        //middlewares
        // const verifyToken = (req, res, next) => {
            // console.log('inside verify token', req.headers.authorization);
            // if (!req.headers.authorization) {
                // return res.status(401).send({ message: 'unauthorized access' });
            // }
            // const token = req.headers.authorization.split('')[1];
            // // jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (error, decoded) => {
                // if (error) {
                    // // return res.status(401).send({ message: 'unauthorized access' })
                // }
                // req.decoded = decoded;
                // next();
            // })





        // };
        //use verify admin after verify token      
        // const verifyAdmin = async (req, res, next) => {
            // const email = req.decoded.email;
            // const query = { email: email };
            // const user = await userCollection.findOne(query);
            // const isAdmin = user?.role === 'admin';
            // if (!isAdmin) {
                // return res.status(403).send({ message: 'forbidden access' });
            // }
            // next();

        // }






        //user releted api 
        app.get('/users', async (req, res) => {

            const result = await userCollection.find().toArray();
            res.send(result);
        });

        app.get('/users/admin/:email',  async (req, res) => {
            const email = req.params.email;
            if (email !== req.decoded.email) {
                return res.status(403).send({ message: 'forbidden access' })
            }
            const query = { email: email };
            const user = await userCollection.findOne(query);
            let admin = false;
            if (user) {
                admin = user?.role === 'admin';
            }
            res.send({ admin });

        })


        app.post('/users', async (req, res) => {
            const user = req.body;
            //insert email if user dosent exists.
            const query = { email: user.email }
            const existingUser = await userCollection.findOne(query);
            if (existingUser) {

                return res.send({ message: 'user already exists', insertedId: null });
            }
            const result = await userCollection.insertOne(user);
            res.send(result);
        })

        app.patch('/users/admin/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) };
            const updatedDoc = {
                $set: {
                    role: 'admin'
                }
            }
            const result = await userCollection.updateOne(filter, updatedDoc)
            res.send(result);
        })

        app.delete('/users/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await userCollection.deleteOne(query);
            res.send(result);
        })

        // jwt related api
        // app.post('/jwt', async (req, res) => {
            // const token = jwt.sign(process.env.ACCESS_TOKEN_SECRET, {
                // expiresIn: '1h'
            // });
            // res.send({ token });

        // })

        //menu related apis


        app.get('/menu', async (req, res) => {
            const result = await menuCollection.find().toArray();
            res.send(result);
        })

        app.get('/reviews', async (req, res) => {
            const result = await reviewsCollection.find().toArray();
            res.send(result);
        })

        //carts collections

        app.get('/carts', async (req, res) => {
            const email = req.query.email;
            const query = { email: email };
            const result = await cartsCollection.find(query).toArray();
            res.send(result);
        });

        app.post('/carts', async (req, res) => {
            const cartItem = req.body;
            const result = await cartsCollection.insertOne(cartItem);
            res.send(result);

        });

        app.delete('/carts/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await cartsCollection.deleteOne(query);
            res.send(result);
        });






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