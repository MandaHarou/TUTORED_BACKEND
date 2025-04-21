const express = require('express');
const router = express.Router();
const {setGet,setPost,updateUser,deletUser,setPut} = require('../controler/userControler');
//Route for find user
router.get('/users',setGet); 
//Route for adduser
router.post('/useradd',setPost);
//Route for update user
router.patch('/users/:id',updateUser);
//Route for delet an user
router.delete('/users/:id',deletUser);
//Route for put an user
router.put('/users/:id',setPut);

module.exports = router;
