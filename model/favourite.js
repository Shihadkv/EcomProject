const mongoose = require("mongoose");

const FavSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required:true
    },
    product:[{
      productId:mongoose.Schema.Types.ObjectId,
      quantity:Number,
      name:String,
      brand:String,
      subtotal:Number,
      discount:Number,
      price:Number,
      image:{
        type:String,
      }
    }
    ],
    total:{
      type:Number,
      default:0
    },
    modifiedOn: {
      type: Date,
      default: Date.now
    }
  }
  
);


const FavModel = mongoose.model("Favourite", FavSchema);
module.exports = FavModel