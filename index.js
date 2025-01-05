const express = require('express')
const app = express()
const port = 3000
const cors = require('cors');

app.use(express.json());
app.use(cors());

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.5g7cb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

app.get('/', (req, res) => {
  res.send('Hello World!')
})


const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    }
  });

  async function run() {
    try {




        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
     } finally {}
  }
  run().catch(console.dir);



app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})