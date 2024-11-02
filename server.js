const express = require('express')

const {MongoClient, ServerApiVersion} = require('mongodb');

const client = new MongoClient(
    "mongodb+srv://sowjanyaUser:sowjanyaPassword@cluster0.k6c97.mongodb.net/students-database",
    {
        serverApi: {
            version: ServerApiVersion.v1,
            strict : true,
            deprecationErrors: true,
        }
    }
)

const PORT = 8082;
const app = express()
app.use(express.json());

const connectDb = async ()=>{
    try {
        await client.connect();
        console.log('Connected Succesfully')
    } catch(error) {
        console.log(error);
    }
}

connectDb();

const addintoCollection = async(data, response) => {
    const db = client.db('IITH');
    const students = db.collection('students')
    try {
        const result = await students.insertOne(data);
        response.json({message : result})
    } catch(error) {
        response.json({ error: "Data insertion failed" })
    }
        
}

const getfromCollection = async (data, response) => {
    const db = client.db('IITH');
    const students = db.collection('students');
    try {
        const results = await students.find(data);
        const result = await results.toArray(); 

        if (result.length === 0) {
            response.json({
                error: "No documents found"
            });
        } else {
            response.json({ message: result });
        }

    } catch (error) {
        console.error("Data retrieval failed:", error);
        response.status(500).json({ error: "Data retrieval failed" });
    }
};


//Home Page
app.get('/', (request, response)=>{
    response.json(
        {
            message : "Hey, hi"
        }
    )
})


//Add page
app.post('/add', (request, response)=>{
    const data = request.body;
    if(!data || Object.keys(data).length===0) {
        response.json(
            {
                error: "The requested type isn't supported"
            }
        )
    } else {
        addintoCollection(data, response);
    }
})

//Fetch page
app.get('/fetch', (request, response) => {
    const data = request.body;
    if(!data || Object.keys(data).length===0) {
        response.json(
            {
                error: "The requested type isn't supported"
            }
        )
    } else {
        getfromCollection(data, response);
    }
})

app.listen(PORT, ()=>{
    console.log(`Server is listening at PORT ${PORT}`);
});

