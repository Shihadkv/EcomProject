const mongoose = require("mongoose");

const CartSchema = new mongoose.Schema(
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
      size:String,
      image:{
        type:String,
      }
    }
    ],
    total:{
      type:Number,
      default:0
    },
    totalAfterDiscount:{
      type:Number,
      default:0
    },
    modifiedOn: {
      type: Date,
      default: Date.now
    }
  }
  
);


const CartModel = mongoose.model("Cart", CartSchema);
module.exports = CartModel