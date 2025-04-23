const mongoose = require('mongoose');
/*
              Main
 */
const messagShema = mongoose.Schema({
    "titre" : {type : String, required: true},
    "id":{type:String, require: true},
    "file":{type: String}
});

const message = mongoose.model('message', messagShema);
/*
              End
 */
module.exports = message;
