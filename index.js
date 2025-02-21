require('dotenv').config();
const express = require('express')
const app = express()
const port = 3000
const cors = require('cors');
const jwt = require('jsonwebtoken');

app.use(express.json());
app.use(cors());




app.get('/',async(req,res)=>{
   res.send("hello world");
})


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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
     
    

     
    const database1 = client.db("Volunteer_need_post");
    const Volunteer_need_post = database1.collection("Volunteer");
    const Volunteer_request = database1.collection('Volunteer_request');


     




    app.post('/volunteer_need_post', async (req, res) => {
      const data = req.body;
      const result = await Volunteer_need_post.insertOne(data);
      res.send(result);
    })

    app.get('/volunteer_needs', async (req, res) => {
      const cursor = Volunteer_need_post.find().limit(6);
      const result = await cursor.toArray();
      res.send(result);
    })


    app.get('/all_volunteer',async(req,res)=>{
      const cursor = Volunteer_need_post.find();
      const result = await cursor.toArray();
      res.send(result);
    })


    app.get('/volunteer_details/:id', async (req, res) => {
      const { id } = req.params;
      const query = { _id: new ObjectId(id) };
      const data = await Volunteer_need_post.findOne(query);
      res.send(data);
    })

    app.post('/volunteer_request',async (req,res)=>{
        const data = req.body;
        const result = await Volunteer_request.insertOne(data);
        res.send(result);
    })

    app.patch('/volunteer_decrement/:id', async (req,res)=>{
      const { id } = req.params;
      const result = await Volunteer_need_post.updateOne(
        { _id: new ObjectId(id) },  
        { $inc: { volunteers_needed: -1 } }  
      );
      res.send(result);
    })




    app.get('/Search_volunteer', async (req, res) => {
         const { title } = req.query;  
         console.log(req.query);
        const volunteers =  Volunteer_need_post.find({ title: { $regex: title || '', $options: 'i' } })
        const result = await volunteers.toArray();
        res.send(result);
    });

    app.get('/my_volunteer_need_post/:id', async(req,res)=>{
         const {id} = req.params;
         const reviews = await Volunteer_need_post.find({ email: id }).toArray();
         res.send(reviews);
    })

    app.get('/my_volunteer_request_post/:id', async(req,res)=>{
        const {id} = req.params;
        const request = await Volunteer_request.find({ volunteer_email: id }).toArray();
        res.send(request);
    })


    app.put('/update_need_post/:id', async (req, res) => {
      const id = req.params.id;
      const data = req.body;
      const options = { upsert: true };
      const query = { _id: new ObjectId(id) };

       

      const updateDoc = {
        $set: {
          cover_img: data.cover_img,
          title: data.title,
          description: data.description,
          category: data.category,
          volunteers_needed: data.volunteers_needed,
          Deadline:data.Deadline,
          location:data.location
        },
      };
      const result = await Volunteer_need_post.updateOne(query, updateDoc, options);

      res.send(result);


    })


    app.delete('/delete_volunteer_post/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await Volunteer_need_post.deleteOne(query);
      res.send(result);
    })

    app.delete('/delete_request/:id', async(req,res)=>{
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await Volunteer_request.deleteOne(query);
      res.send(result);
    })

     
    
  } finally {
    
     
  }
}
run().catch(console.dir);




app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})