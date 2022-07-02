const express = require('express');
const cors = require('cors');
const app = express()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000
require('dotenv').config()

// Middleware
app.use(cors())
app.use(express.json())



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.a6fpj.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run() {
    try {
        await client.connect()
        console.log("DB Connected");

        const totalTodo = client.db('Todo-App').collection('totaltodo')

        app.post('/api/addingTodo', async (req, res) => {
            const data = req.body
            const result = await totalTodo.insertOne(data)
            res.send(result)
        })

        app.get('/api/gettingTodo', async (req, res) => {
            const email = req.query.email;
            const query = { email: email }
            const result = await totalTodo.find(query).toArray()
            res.send(result)
        })

        app.put('/api/editTask/:id', async (req, res) => {
            const id = req.params.id
            const taskInput = req.body
            const filter = { _id: ObjectId(id) }
            const options = { upsert: true };
            const updateText = {
                $set: {
                    taskInput: taskInput.taskInput,
                },
            };
            const result = await totalTodo.updateOne(
                filter,
                updateText,
                options
            );
            res.send(result);
        })

        app.put('/api/completeTask/:id', async (req, res) => {
            const id = req.params.id
            const filter = { _id: ObjectId(id) }
            const updateDoc = {
                $set: {
                    complete: true
                }
            }
            const result = await totalTodo.updateOne(filter, updateDoc)
            res.send(result)
        })

        app.get('/api/completedTask', async (req, res) => {
            const email = req.query.email;
            // const queryId = req.query.id;
            // const id = { _id: ObjectId(queryId) }
            const query = { email: email, complete: true }
            const result = await totalTodo.find(query).toArray()
            res.send(result)
        })

    }

    finally {

    }

}

run().catch(console.dir)


app.get('/', (req, res) => {
    res.send("Hello Todo App")
})

app.listen(port, () => {
    console.log("Your Server Is Running at", port);
})