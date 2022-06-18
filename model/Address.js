
const mongoose = require("mongoose");

const AddressSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required:true
    },
    address:[{
     firstName:String,
     lastName:String,
     phoneNumber:Number,
     counrty:String,
     companyName:String,
     houseName:String,
     landMark:String,
     village:String,
     district:String,
     city:String,
     postal:Number,
     status:{
       type:Boolean,
       default:false
     }
    }
    ],
    modifiedOn: {
      type: Date,
      default: Date.now
    }
  }
  
);


const AddressModel = mongoose.model("Address",AddressSchema);
module.exports = AddressModel