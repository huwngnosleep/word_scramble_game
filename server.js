const express = require('express')
const mongoose = require('mongoose');
const app = express()
const port = 8000
const cors = require('cors')
var corsOptions = {
    origin: '*',
}
app.use(cors(corsOptions));

let QuestionModel
async function connectDB() {
    await mongoose.connect('mongodb://127.0.0.1:27017/testdb');
        
    const Question = new mongoose.Schema({
        text: String,
        image: String,
    });
    QuestionModel = mongoose.model('Question', Question)
}


app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/questions', async (req, res) => {
    

    const questions = await QuestionModel.aggregate([{
        "$sample": {size: 5}
    }])

    return res.json(questions)
})

connectDB().then(() => app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
}))