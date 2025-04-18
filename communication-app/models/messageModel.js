const mongoose = require('mongoose');

const messagShema = mongoose.Schema({
    "titre" : {type : String, required: true},
    "id":{type:String, require: true}
});

const message = mongoose.model('message', messagShema);

module.exports = message;
