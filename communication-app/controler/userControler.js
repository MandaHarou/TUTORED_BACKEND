const mongoose = require('mongoose');
const express  = require('express');
const User = require('../models/userModel');

module.exports.setPost = async (req, res)=>{
    try{
        const sendmes = await User.create({
                name: req.body.name,
                role: req.body.role,
                ip: req.body.ip,
                token: req.body.token,
                isConnected: req.body.isConnected,
        })
        .then((res, req)=>{
            res.status(201).json({"message" : sendmes})
        }).catch(error=>{res.status(400).json({error : error })}); 
    }
    catch(error){
        res.status(500).json({
            error :'Error internal server'
        });
    }
}
module.exports.setGet= async (req, res)=>{
    try{
        const profile = await User.find()
        .then(User => res.status(200).json({User}))
        .catch(error=>{res.status(400).json({error : error })}); 
    }catch(error){
        res.status(500).json({
            error :'Error internal server'
        });
    }

}