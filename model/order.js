
const Mongoose = require("mongoose");

const orderSchema = new Mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  product: [
    {
      ProductId: Mongoose.Types.ObjectId,
      name: String,
      price: Number,
      brand: String,
      image: String,
      quantity: Number,
      subTotal: Number,
      discount:Number,
      paid: {
        type: String,
        default: "Not Paid",
      },
      status: {
        type: String,
        default: "Ordered",
      },
      created: String,
      deliverDate: {
        type: String,
        default: null,
      },
      paymentType: {
        type: String,
        required: true,
      },
      active:{
        type:Boolean,
        default:true
      }
    },
  ],
  address:{
    type:Object,
    firstName:String,
    lastName:String,
    landMark:String,
    district:String,
    phoneNumber:Number,
    city:String,
    postal:Number,
    houseName:String,
    paymentMethod:String,
},
  totalAmount: {
    type: Number,
    default: 0,
  },
  Totalafter_discount:{
    type: Number,
    default: 0,
  },
//   couponDiscount: {
//     type: Number,
//     default: 0,
//   },
  count: {
    type: Number,
  },
  modifiedOn: {
    type: Date,
    default: Date.now()
  }
 
});

const orderModel = Mongoose.model("Order", orderSchema);

module.exports = orderModel;