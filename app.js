const dotenv = require('dotenv').config();
const mongoose = require('mongoose');
const cors = require('cors');
const express = require('express');
const bdconect = require('./config/db');
const router = 
const app = express();
const port = process.env.PORT;
app.use(express.json());
app.use(cors());
bdconect();

app.use('/', require('../controler/messageControler'));

app.listen(port,()=>{
  console.log("the port in action that port: ",port);
});
