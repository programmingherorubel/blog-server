const express = require('express')
const  app = express()
const cors = require('cors')
const dotenv = require('dotenv')
const { MongoClient, ServerApiVersion } = require('mongodb');
const ObjectId = require('mongodb').ObjectId
const port =process.env.PORT ||5000

// DB_USER=aysha
// DB_PASS=qPwNXjMslezCbseE
dotenv.config()
// app.use(cors())
const corsConfig = {
    origin: '',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE']
}
app.use(cors(corsConfig))
app.options("", cors(corsConfig))
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.i8wrn.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

    async function run(){
        
        try{
            await client.connect();
            const database = client.db("aysha_asha_personal_blog");
            const personal_blog_collection = database.collection("personalblog");
            const japanese_blog_collection = database.collection("japaneseblog");
            const japaneseCommentsCollection = database.collection("japaneseComments");
            const personalCommentsCollection = database.collection("jpersonalComments");
            const website_User_collection = database.collection("websiteUser");

                // PERSONAL BLOG 
                app.post('/personalblog',async (req,res)=>{
                    const newpersonalblog = req.body;
                    const result = await personal_blog_collection.insertOne(newpersonalblog)
                    res.json(result)
                })

                app.get('/personalblog',async(req,res)=>{
                    const cursor =  personal_blog_collection.find({})
                    const personalblog = await cursor.toArray()
                    res.send(personalblog)
                })
                app.delete('/personalblog/:id',async(req,res)=>{
                    const id = req.params.id
                    const query = {_id:ObjectId(id)}
                    const result = await personal_blog_collection.deleteOne(query)
                    console.log(result)
                    res.json(result)
    
                })
            
                // JAPANESE BLOG 
                app.post('/japaneseblog',async (req,res)=>{
                    const newjapaneseblog = req.body;
                    const result = await japanese_blog_collection.insertOne(newjapaneseblog)
                    res.json(result)
                })

                app.get('/japaneseblog',async(req,res)=>{
                    const cursor =  japanese_blog_collection.find({})
                    const japaneseblog = await cursor.toArray()
                    res.send(japaneseblog)
                })
                app.delete('/japaneseblog/:id',async(req,res)=>{
                    const id = req.params.id
                    const query = {_id:ObjectId(id)}
                    const result = await japanese_blog_collection.deleteOne(query)
                    console.log(result)
                    res.json(result)
    
                })

                // WEBSITE USER 
                app.post('/user',async (req,res)=>{
                    const newUser = req.body ;
                    const result = await website_User_collection.insertOne(newUser)
                    res.send(result)
                })

                app.put('/user',async (req,res)=>{
                    const user = req.body;
                    const filter = {email:user.email};
                    const options = {upsert : true};
                    const updateDoc = {$set:user};
                    const result = await website_User_collection.updateOne(filter,updateDoc,options)
                    res.json(result)
                })

                app.get('/user',async(req,res)=>{
                    const cursor =website_User_collection.find({})
                    const user = await cursor.toArray()
                    res.send(user)
                })

                app.put('/user/admin',async(req,res)=>{
                    const user = req.body;
                    const filter = {email:user.email};
                    const updateDoc = {$set: {role:'admin'}}
                    const result = await website_User_collection.updateOne(filter,updateDoc)
                    res.json(result)
                })
            // special email admin 
            app.get('/user/:email',async(req,res)=>{
                const email = req.params.email;
                const query = {email:email};
                const user = await website_User_collection.findOne(query)
                let isAdmin = false;
                    if(user?.role === 'admin'){
                        isAdmin = true
                    }
                    res.json({admin:isAdmin})
            })

            // JAPANESE COMMENTS 
            app.post('/comments',async (req,res)=>{
                const newComments = req.body; 
                const comments = await japaneseCommentsCollection.insertOne(newComments)
                res.json(comments)
            })
            //JAPANESE COMMENTS GET
            app.get('/comments',async(req,res)=>{
                const cursor = japaneseCommentsCollection.find({})
                const comment = await cursor.toArray()
                res.send(comment)
            })

            //JAPANESE COMMENTS DELETE
            app.delete('/comments/:id',async(req,res)=>{
                const id = req.params.id
                const query = {_id:ObjectId(id)}
                const result = await japaneseCommentsCollection.deleteOne(query)
                console.log(result)
                res.json(result)

            })

            //PERSONAL COMMENTS 
            app.post('/blogComments',async (req,res)=>{
                const newComments = req.body; 
                const comments = await personalCommentsCollection.insertOne(newComments)
                res.json(comments)
            })
            app.get('/blogComments',async(req,res)=>{
                const cursor = personalCommentsCollection.find({})
                const comment = await cursor.toArray()
                res.send(comment)
            })
            app.delete('/blogComments/:id',async(req,res)=>{
                const id = req.params.id
                const query = {_id:ObjectId(id)}
                const result = await personalCommentsCollection.deleteOne(query)
                console.log(result)
                res.json(result)

            })

        }
        finally{

        }
    }
    run().catch(console.dir)

app.get('/', (req, res) => {
    res.send('server is running')
  })
  
  app.listen(port, () => {
    console.log(`lisining server number${port}`)
  })

//   aysha
// tnbAzygQWOLsHEXn