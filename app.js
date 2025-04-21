
const cors = require('cors');
const mongoose = require('mongoose');
const express = require('express');
const bdconect = require('./config/db');

const app = express();
const port = process.env.PORT || 3000;
app.use(express.json());
app.use(cors());
bdconect();

app.use('/post', require('../communication-app/routes/userRoutes'));

app.listen(port,()=>{
  console.log("the port in action that port:http://localhost:3000",port);
});
