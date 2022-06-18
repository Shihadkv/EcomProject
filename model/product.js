
const mongoose = require("mongoose")

const productSchema  = new mongoose.Schema({
    name:{
        type: String,
         required:true
    },
    images:{
        type:Array,
        required:true
    },
    productName:{
        type:String,
         required:true
    },
    brand:{
        type: String,
        
        // required:true
    },
    companyName:{
        type:String,
        required:true
    },
    price:{
        type:String,
        required:true
    },
    discountprice:{
        type:String,
        required:true
    },
    category:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"category",
        required:true
    },
    subcategory:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"subcategory",
        required:true
    },
    description:{
        type:String,
        // required:true
    },
    colour:{
        type:String,
        // required:true
    },
    stock:{
        type:Number,
        required:true
    }

   



})

const Addproduct = mongoose.model("products",productSchema)

module.exports = Addproduct;