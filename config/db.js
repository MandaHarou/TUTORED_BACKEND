const mongoose = require('mongoose');

const bdconect = async()=>{
    try{
        mongoose.connect('mongodb://localhost:27017/communication-app',()=>{
            console.log("conected with moggodb successfully");
        });
    }
    catch(error){
        console.status(500).log('internal server error');
        process.exit();
    }
};
module.exports = bdconect;