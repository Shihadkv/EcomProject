const mongoose = require("mongoose")


const categorySchema= new mongoose.Schema({

    name:{
        type:String,
        required:true,
    
    },
    Created_at:{
        type:Date,
        default:Date.now
        
    }
})
const Category = mongoose.model("category",categorySchema)
module.exports = Category;

