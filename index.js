// eslint-disable-next-line @typescript-eslint/no-require-imports
const express = require('express');
// eslint-disable-next-line @typescript-eslint/no-require-imports
const mongoose = require('mongoose');
const app = express();


app.get('/', (req, res) => {
    res.send('Hello from Node API Server Updated');
})

app.post('/api/products', async (req, res) => {
    res.send('Create a new product');
});
mongoose.connect("mongodb+srv://phuctran:abcd1234@studymvp.r2cbawj.mongodb.net/?appName=Studymvp")
    .then(() => {
        console.log('MongoDB connected');
        app.listen(3000, () => {
            console.log('Server is running on port 3000');
        });
    })
    .catch(() => {
        console.error('MongoDB connection error:');
    })
