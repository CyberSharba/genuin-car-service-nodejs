const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app = express()
const port = process.env.PORT || 5000;

// ///middleware\\\\\
app.use(cors())
app.use(express.json())



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ok4i7vc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
    const serviceCollection = client.db('geniusCar').collection('service');
    
    // ////data mongo thaka load korae\\\\\\\\\
    app.get('/service',async(req,res) => {
        const query = {};
        const cursor = serviceCollection.find(query);
        const services = await cursor.toArray();
        res.send(services)
    });
//////////find id one\\\\\\\
    app.get('/service/:id',async(req,res) => {
        const id = req.params.id;
        const query = {_id:new ObjectId(id)}
        const service = await serviceCollection.findOne(query)
        res.send(service)
    })
    // //////post\\\\\\\\\\\
    app.post('/service',async(req,res) => {
        const newService = req.body;
        const result = await  serviceCollection.insertOne(newService);
        res.send(result)

    })

    ////Delete\\\\\\\\\\
    app.delete('/service/:id',async(req,res)=>{
        const id = req.params.id;
        const query = {_id:new ObjectId(id)} 
        const result = await serviceCollection.deleteOne(query)
        res.send(result)
    })


    
  }
   catch(error) {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);




app.get('/', (req, res) => {
  res.send('Hello ')
})
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })