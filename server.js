const express = require('express');
const { MongoClient, ServerApiVersion } = require('mongodb');

const client = new MongoClient(
    "mongodb+srv://sowjanyaUser:sowjanyaPassword@cluster0.k6c97.mongodb.net/students-database",
    {
        serverApi: {
            version: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true,
        }
    }
);

const PORT = 8082;
const app = express();
app.use(express.json());

const connectDb = async () => {
    try {
        await client.connect();
        console.log('Connected Successfully');
    } catch (error) {
        console.log(error);
    }
}

connectDb();

const addintoCollection = async (data, response) => {
    const db = client.db('IITH');
    const students = db.collection('students');
    try {
        const result = await students.insertOne(data);
        response.status(201).json({ message: result });
    } catch (error) {
        console.error("Data insertion failed:", error);
        response.status(500).json({ error: "Data insertion failed" });
    }
}

const getfromCollection = async (data, response) => {
    const db = client.db('IITH');
    const students = db.collection('students');
    try {
        const results = await students.find(data);
        const result = await results.toArray();

        if (result.length === 0) {
            response.status(404).json({ error: "No documents found" });
        } else {
            response.json({ message: result });
        }
    } catch (error) {
        console.error("Data retrieval failed:", error);
        response.status(500).json({ error: "Data retrieval failed" });
    }
};

const deletefromCollection = async (data, response) => {
    const db = client.db('IITH');
    const students = db.collection('students');
    try {
        const results = await students.deleteOne(data);
        response.json({ message: results });
    } catch (error) {
        console.error("Data deletion failed:", error);
        response.status(500).json({ error: "Data deletion failed" });
    }
};

const updatetheCollection = async (data, response) => {
    const db = client.db('IITH');
    const students = db.collection('students');

    try {
        if (Array.isArray(data)) {
            const [find, update] = data;
            const results = await students.updateOne(find, update);
            response.json({ message: results });
        } else {
            response.status(400).json({ error: "Invalid format" });
        }
    } catch (error) {
        console.error("Failed to update:", error);
        response.status(500).json({ error: "Failed to update" });
    }
}

// Home Page
app.get('/', (request, response) => {
    response.json({ message: "Hey, hi" });
});

// Add Page
app.post('/add', (request, response) => {
    const data = request.body;
    if (!data || Object.keys(data).length === 0) {
        response.status(400).json({ error: "The requested type isn't supported" });
    } else {
        addintoCollection(data, response);
    }
});

// Fetch Page
app.get('/fetch', (request, response) => {
    const data = request.body; // Consider changing this to use query parameters instead
    if (!data || Object.keys(data).length === 0) {
        response.status(400).json({ error: "The requested type isn't supported" });
    } else {
        getfromCollection(data, response);
    }
});

// Delete Page
app.delete('/delete', (request, response) => {
    const data = request.body;
    if (!data || Object.keys(data).length === 0) {
        response.status(400).json({ error: "The requested type isn't supported" });
    } else {
        deletefromCollection(data, response);
    }
});

// Update Page
app.put('/update', (request, response) => {
    const data = request.body;
    if (!data || Object.keys(data).length === 0) {
        response.status(400).json({ error: "The requested type isn't supported" });
    } else {
        updatetheCollection(data, response);
    }
});

app.listen(PORT, () => {
    console.log(`Server is listening at PORT ${PORT}`);
});
