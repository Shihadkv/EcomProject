const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
    email:{
        type:String
    },
    password:{
        type:String
    }
})
    

const AdminLog = mongoose.model("Admin",adminSchema)

module.exports = AdminLog