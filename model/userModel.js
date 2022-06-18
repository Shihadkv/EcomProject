const mongoose = require("mongoose")

    const UserSchema = new mongoose.Schema({
      name: {
        type: String,
        required:true
      },
      email:{
          type: String,
          required:true,
          unique: true
      },
      password:{
      type:String,
      required:true
    },
    number:{
        type:Number,
    },
    status:{
      type:Boolean,
      default:true
    },
  useraddress:{
    firstName:String,
    lastName:String,
    phoneNumber:Number,
    counrty:String,
    companyName:String,
    houseName:String,
    landMark:String,
    district:String,
    city:String,
    postal:Number,
    status:Boolean
  }
    });
const userModel = mongoose.model("users",UserSchema)
module.exports = userModel;

    

