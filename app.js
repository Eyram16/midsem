const express = require('express');
const employeelist = require('./employee.json');
// const todolist = require('./todolist.json');

const { MongoClient } = require('mongodb');

const uri = 'mongodb://localhost:27017'
const client = new MongoClient(uri, { useUnifiedTopology: true, useNewUrlParser: true })

let employeeDb;
let todolistCollection;

// this function connects the the mongodb
const mainConnet = async () => {
    await client.connect();
    employeeDb = client.db('employeedb');

    todolistCollection = employeeDb.collection('todo');
    
} 
mainConnet();

const createTodo = async (data) => {
    try {
        const result = await todolistCollection.insertOne(data);
        return result;

    } catch (error) {
        console.log(error)
    }
}

const getAll = async () => {
    try {
        const result = await todolistCollection.find({}).toArray();
        return result;
    } catch (error) {
        console.log(error)
    }
} 


const app = express()

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.get('/', (req, res)=>{
    res.redirect('/employeeList')
});

app.get('/employeeList', (req, res)=>{
    res.render('landing', {
        employeelist
    })
});

app.get('/todoList', async (req, res)=>{
    const todolist = await getAll();
    res.render('todo', {
        todolist
    })
})

app.post('/upload', async (req, res) => {
    const data = {
        activity: req.body.activity,
        status: req.body.status
    }
    const result = await createTodo(data);
    res.redirect('/todoList')
});


// Serve applicationon port 2000
const port = 2000;
app.listen(port, () =>{
    console.log(`Server has started on on port ${port}`);
});