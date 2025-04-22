const cors = require('cors');
const mongoose = require('mongoose');
const express = require('express');
const bdconect = require('./config/db');
const dotenv = require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;
app.use(express.json());
app.use(cors());
bdconect();

app.use('/user', require('./routes/userRoutes'));
app.use('/log',require('./routes/logroutes'));
app.listen(port,()=>{
  console.log("the port in action that port:http://localhost:3000",port);
});
