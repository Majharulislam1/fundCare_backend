require('dotenv').config();
const express = require('express')
const app = express()
const port = 3000
const cors = require('cors');

app.use(express.json());
app.use(cors());




app.get('/',async(req,res)=>{
   res.send("hello world");
})


const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.5g7cb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
     
    await client.connect();

     
    const database1 = client.db("Volunteer_need_post");
    const Volunteer_need_post = database1.collection("Volunteer");

    app.post('/volunteer_need_post', async (req, res) => {
      const data = req.body;
      const result = await Volunteer_need_post.insertOne(data);
      res.send(result);
    })

    app.get('/volunteer_needs', async (req, res) => {
      const cursor = Volunteer_need_post.find().sort({ Deadline: 1 }).limit(6);
      const result = await cursor.toArray();
      res.send(result);
    })

     
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    
    // await client.close();
  }
}
run().catch(console.dir);




app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})