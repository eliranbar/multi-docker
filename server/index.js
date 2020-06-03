const keys = require('./keys');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const {Pool} = require('pg');
const pgClient = new Pool({
    user: keys.pgUser, 
    host: keys.pgHost,
    database: keys.pgDatabase,
    password: keys.pgPassword,
    port: keys.pgPort
});
pgClient.on('error', ()=>{
    console.log('lost pg connection');
});

pgClient.query('CREATE TABLE IF NOT EXISTS values (number INT)').catch(err=>console.log(err)); //create table with the name values that include on row in the name 'number' from type int

// redis client setup
const redis = require('redis');
const redisClient = redis.createClient({
    host: keys.redisHost,
    port: keys.redisPort,
    retry_strategy: () => 1000
});

const redisPublisher = redisClient.duplicate();

// express rout hadlers 

app.get('/', (req, res)=>{
    res.send('Hi');
});

app.get('/values/all', async(req, res)=>{
    const values = await pgClient.query('SELECT * from values');
    res.send(values.rows);
});

app.get('/values/current', async(req, res)=>{
    redisClient.hgetall('values', (err, values)=>{
        res.send(values);
    });
});

app.post('/values', async(req, res)=>{
    const index = req.body.index;
    if(parseInt(index)>40){
        return res.status(422).send('Index is too hight');
    };
    
    redisClient.hset('values', index, 'Nothig yet!');
    redisPublisher.publish('insert', index);
    pgClient.query('INSERT INTO values(number) VALUES($1)', [index]);
    res.send({working: true});
});

app.listen((5000), (err)=>{
    console.log('lisening');
})