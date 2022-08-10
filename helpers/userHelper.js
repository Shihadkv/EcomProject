const userModel = require('../model/userModel')
const bcrypt = require('bcrypt')
const nodemailer = require('nodemailer')
var jwt = require('jsonwebtoken')
const { Model } = require('mongoose')
const { reject } = require('bcrypt/promises')
const async = require('hbs/lib/async')

const randomstring = require("randomstring")
const Addproduct = require('../model/product')
const cart = require('../model/cart')
const { response, locals } = require('../app')
const CartModel = require('../model/cart')
const FavModel = require('../model/favourite')
const AddressModel = require('../model/Address')
// const { count } = require('../model/userModel')
const { exist } = require('joi')
const { findOne } = require('../model/cart')
const OrderModel = require('../model/order')
const orderModel = require('../model/order')
const BrandModel = require('../model/brand')
const subcategory = require('../model/subcategory')
const Category = require('../model/category')
var objectId = require('mongoose').ObjectId

const Razorpay = require('razorpay');
const { resolve } = require('path')

var instance = new Razorpay({
    key_id: 'rzp_test_jwEdfqWnIlISam',
    key_secret: 'hmt50bjLzxNzzJCsfjIX7pFx',
});





const dosignup = (data) => {
    console.log(data);
  
   
    return new Promise(async (resolve, reject) => {

        let email =  await userModel.findOne({email:data.email})
        console.log(email,"emaillllll");
        if(email){
            reject({msg:"email is already exist"})
        }else
        {
            const otpCode = Math.floor(1000 + Math.random() * 9000)
            console.log(otpCode);
            let transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: 'shihad530@gmail.com',
                    pass: 'yhufegoqmdhqslpb',
                }
            })
            let otpCode1 = {
                from: 'shihad530@gmail.com',
                to: data.email,
                subject: "mail using node mailer",
                html: `<h3> Here is ${data.name} </h3>
                        <h1>Welcome to our store and your OTP code is - ${otpCode}</h1>`
    
            }
            transporter.sendMail(otpCode1, function (err, info) {
                if (err) reject({ msg: "messageis not send" })
             
                console.log("mail send succesfully");
                resolve({ msg: "succes", otpCode })
            })
        }
    })
    
}

//optverification

const otpverify = (otpData, otpCode, data) => {



    return new Promise(async (resolve, reject) => {
        const userOtp = otpData.otp1 + otpData.otp2 + otpData.otp3 + otpData.otp4
        if (otpCode == userOtp) {

            const Password = await bcrypt.hash(data.password, 10)


            const newUser = await new userModel({
                name: data.name,
                email: data.email,
                password: Password,
                number: data.number,
                cnfmpassword: data.cnfmpassword,
                address: {

                }
            })
            console.log(newUser);
            await newUser.save()
            resolve({ status: true })
        } else {
            reject({ status: false, msg: "otp verification failed" })
        }
    })
}











const doLogin = (data) => {
    return new Promise(async (resolve, reject) => {

        let response = {}
        const user = await userModel.findOne({ email: data.email})
        console.log(user);
        if (user) {
              if(user.status){
                console.log("nabelll");
                bcrypt.compare(data.password, user.password).then((comp) => {
                    if (comp) {
                        console.log('login is succesfull');
                        
                    } else {
                        console.log('login failed');
                        reject({ status: false, msg: "password is incorrect" })
                    }
                })
              }else{
                reject({status:false, msg: "You are blocked"})
              }
           
        } else {
            console.log('login failed');
            reject({ status: false, msg:"please do register"})
        }
    })
}



const sendPasswordResetMail = async (name, email, tocken) => {

    try {
        const mailTransporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            service: "gmail",
            port: 465,
            secure: true,
            auth: {
                user: "shihad530@gmail.com",
                pass: "mdfvpgowslqrqacj"
            },
            tls: {
                rejectUnauthorized: false
            }

        });

        const mailDetails = {
            from: "shihad530@gmail.com",
            to: email,
            subject: "Reset Password",
            text: "just random texts ",
            html: '<p>Hi ' + name + ' click <a href ="http://localhost:3000/resetpswd?token=' + tocken + '"> here to </a> to reset your password</p>'
        }
        mailTransporter.sendMail(mailDetails, (err, Info) => {
            if (err) {
                console.log(err);
            } else {
                console.log("email has been sent ", Info.response);
            }
        })
    } catch (error) {
        console.log(error.message);
    }

}



// forget password starts

const forgetLoad = async (req, res) => {
    try {
        res.render('user/forgetpswd', { errmsg: req.session.message })
        req.session.message = false;
    } catch (error) {
        console.log(error.message);
    }
}

const forgetVerify = async (req, res) => {
    try {
        const email = req.body.email;
        const userData = await userModel.findOne({ email: email })

        if (userData) {
            const randomString = randomstring.generate();
            const updatedData = await userModel.updateOne({ email: email }, { $set: { token: randomString } });

            sendPasswordResetMail(userData.name, userData.email, randomString)
            res.redirect('/forgetpswd')
        } else {
            req.session.message = "user mail is incorrect"
            res.redirect('/forgetpswd')
        }
    } catch (error) {
        console.log(error.message);
    }
}

const forgetPasswordLoad = async (req, res) => {
    try {
        const token = req.query.token;
        const tokenData = await userModel.findOne({ token: token })
       
        console.log(tokenData);
        if (tokenData && tokenData._id) {
            res.render('user/resetpswd', { _id: tokenData._id })
        } else {
            res.render('404', { message: "token is invalid" })
        }
    } catch (error) {
        console.log(error.message);
    }
}
// password bycript

// const securePasssword = async(password)

const resetPassword = async (req, res) => {
    try {
        const newpassword = req.body.password;
        const user_id = req.body.user_id;
        const newPassword = await bcrypt.hash(newpassword, 10)
        console.log(user_id);
        console.log(newPassword);
        //    const secure_password = await
        const updatedPassword = await userModel.findByIdAndUpdate({ _id: user_id }, { $set: { password: newPassword } })
        console.log("updatedPassword=========");
        console.log(updatedPassword);
        res.redirect('/login')


    } catch (error) {
        console.log(error.message);
    }
}

const categoryFilter = () =>{
    return new Promise (async(resolve,reject)=>{
        let filter = {};
        if(req.query.subcatogories){
            filter = {subcategory: req.query.subcatogories.split(',')}
        }
         const productList = await Addproduct.find(filter).populate('category'); // its actually subcat
         resolve(productList)
    })
   
    
}



const featuredProduct = () => {
    return new Promise(async (resolve, reject) => {
        let data = await Addproduct.find({}).sort({ _id: -1 }).limit(10).lean().then((data) => {

            if (data) {
                resolve(data)
            }
        })
    })
}

/* ---favorites add---*/

const addingTofavourte = (id, data) => {

    return new Promise(async (resolve, reject) => {
        let userFav = await FavModel.findOne({ userId: data.email })
        let products = await Addproduct.findOne({ _id: id })


        if (userFav) {
            let exists = userFav.product.findIndex((product) => product.productId == id);
            if (exists != -1) {

                await FavModel.updateOne({ userId: data.email, 'product.productId': id }, { $inc: { 'product.$.quantity': 1 } });
                resolve();
            } else {
                await FavModel.findOneAndUpdate({ userId: data.email },
                    {
                        $push: {
                            product: {
                                productId: id,
                                quantity: 1,
                                name: products.productName,
                                brand: products.brand,
                                price: products.price,
                                subtotal: products.price,
                                // shippingcost:products.shippingcost,
                                discount: products.discountprice,
                                image: products.images[0].img1
                            },
                        },
                    }
                )
                resolve();
            }

        } else {
            let updatedFav = new FavModel({
                userId: data.email,
                product: {
                    productId: id,
                    quantity: 1,
                    name: products.productName,
                    brand: products.brand,
                    price: products.price,
                    subtotal: products.price,
                    // shippingcost:products.shippingcost,
                    discount: products.discountprice,
                    image: products.images[0].img1
                },
                total: products.price
            });
            updatedFav.save(async (err, result) => {
                if (err) {
                    reject({ msg: "favourites is not added" })
                } else {
                    resolve({ msg: "favourites is added" })
                }
            })
        }
    });

};

const getFavCount = (data) => {

    return new Promise(async (resolve, reject) => {

        let favourite = await FavModel.findOne({ userId:data.email})
        console.log(data.email);
        if (favourite) {
            count = favourite.product.length
            console.log(count, "this is fav count");
            resolve(count)
        } else {
            let count = 0;
            resolve(count)
        }
    })

}


const deletingFavourites = (id, data) => {
    return new Promise(async (resolve, reject) => {
        let favItems = await FavModel.findOne({ userId: data.email })
        if (favItems) {
            await FavModel.findOneAndUpdate({ userId: data.email }, { $pull: { product: { productId: id } } })
            resolve()
        }
        reject({ status: false, msg: "item is not deleted" })
    })
}


const favItems = (data) => {

    return new Promise(async (resolve, reject) => {
        const favitem = await FavModel.findOne({ userId: data.email }).lean()

        resolve(favitem)
    })
}

/* --- addingto cart */
const addingToCart = (id, data) => {

    return new Promise(async (resolve, reject) => {
        let userCart = await CartModel.findOne({ userId: data.email })
        let products = await Addproduct.findOne({ _id: id })
   let brand = await BrandModel.findById({_id:products.brand})
   console.log(brand,"sabbbbb");

        if (userCart) {
            let exists = userCart.product.findIndex((product) => product.productId == id);
            if (exists != -1) {

                await CartModel.updateOne({ userId: data.email, 'product.productId': id }, { $inc: { 'product.$.quantity': 1 } });
                resolve();
            } else {
                await CartModel.findOneAndUpdate({ userId: data.email },
                    {
                        $push: {
                            product: {
                                productId: id,
                                quantity: 1,
                                name: products.productName,
                                brand: brand.name,
                                price: products.price,
                                subtotal: products.price,
                                // shippingcost:products.shippingcost,
                                discount: products.discountprice,
                                image: products.images[0].img1
                            },
                        },
                    }
                )
                resolve();
            }

        } else {
            let updatedCart = new CartModel({
                userId: data.email,
                product: {
                    productId: id,
                    quantity: 1,
                    name: products.productName,
                    brand: brand.name,
                    price: products.price,
                    subtotal: products.price,
                    // shippingcost:products.shippingcost,
                    discount: products.discountprice,
                    image: products.images[0].img1
                },
                total: products.price,
                totalAfterDiscount: products.discountedprice
            });
            updatedCart.save(async (err, result) => {
                if (err) {
                    reject({ msg: "cart is not added" })
                } else {
                    resolve({ msg: "cart is added" })
                }
            })
        }
    });

};







const cartItems = (data) => {
    // console.log(data.email);
    return new Promise(async (resolve, reject) => {
        const cartitem = await CartModel.findOne({ userId: data.email }).lean()
            resolve(cartitem)
    })
}

const deletingCart = (id, data) => {
    return new Promise(async (resolve, reject) => {
        let cartItems = await CartModel.findOne({ userId: data.email })
        if (cartItems) {
            await CartModel.findOneAndUpdate({ userId: data.email }, { $pull: { product: { productId: id } } })
            resolve()
        }
        reject({ status: false, msg: "item is not deleted" })
    })
}


const productShow = (proId) => {
    return new Promise(async (resolve, reject) => {
        let showProduct = await Addproduct.findOne({ _id: proId }).lean()

        if (showProduct) {
            resolve(showProduct)
        } else {
            reject({ message: "somthing went wrong" })
        }
    })
}


const getCartCount = (data) => {

    return new Promise(async (resolve, reject) => {

        let cart = await CartModel.findOne({ userId: data.email })
        console.log(data.email);
        if (cart) {
            count = cart.product.length
            resolve(count)
        } else {
            let count = 0;
            resolve(count)
        }
    })


}

// const decrimentProducts = (data, user) => {


//     return new Promise(async (resolve, reject) => {

//         let userCart = await CartModel.findOne({ userId: user.email })

//         if (data.quantities <= 1) {

//             resolve()
//         } else {
//             if (userCart) {
//                 let exists = userCart.product.findIndex((product) => product.productId == data.productId)
//                 if (exists != -1) {
//                     await CartModel.updateOne(
//                         { userId: user.email, 'product.productId': data.productId },
//                         { $inc: { "product.$.quantity": -1 } }
//                     );
//                     resolve();
//                 }
//             }
//         }
//     })
// }


// const incrementsProducts = (data, user) => {


//     return new Promise(async (resolve, reject) => {
//         let userCart = await CartModel.findOne({ userId: user.email })
//         let product = await Addproduct.findOne({ productId: data.productId })

//         if (userCart) {
//             let newQuantity = userCart.product.map((e) => e.quantity);
//             quantity = newQuantity.pop();
//             if (quantity < product.stock) {
//                 await CartModel.updateOne(
//                     { userId: user.email, 'product.productId': data.productId },
//                     { $inc: { "product.$.quantity": 1 } }
//                 );
//                 resolve();
//             } else {
//                 reject({ status: false })
//             }
//         }
//     })
// }

const totalAmount = (user) => {

    return new Promise(async (resolve, reject) => {
        let total = await CartModel.aggregate([
            {
                $match: { userId: user.email },
            },
            {
                $unwind: "$product",
            },
            {
                $project: {
                    quantity: '$product.quantity',
                    price: '$product.price',
                },
            },
            {
                $project: {
                    name: 1,
                    quantity: 1,
                    price: 1,
                },
            },
            {
                $group: {
                    _id: null,
                    total: { $sum: { $multiply: ["$quantity", "$price"] } },
                },
            },

        ]);

        console.log(total, "total")
        if (total.length == 0) {

            resolve({ status: true });
        } else {

            let grandTotal = total.pop();
            await CartModel.findOneAndUpdate(
                { userId: user.email },
                { $set: { total: grandTotal.total } }
            );
            resolve({ status: true });
        }
        // resolve()
    });
};


const subTotal = (user) => {
    return new Promise(async (resolve, reject) => {
        let amount = await CartModel.aggregate([
            {
                $match: { userId: user.email },
            },
            {
                $unwind: "$product",
            },
            {
                $project: {
                    id: "$product.productId",
                    total: { $multiply: ["$product.price", "$product.quantity"] },
                },
            },
        ]);


        let inCart = await CartModel.findOne({ userId: user.email });
        if (inCart) {

            amount.forEach(async (amt) => {
                await CartModel.updateMany(
                    { "product.productId": amt.id },
                    { $set: { "product.$.subtotal": amt.total } }
                );
            });
            resolve()
        }
        // resolve({ status: true })  
    });
};


const discount = (user) => {

    return new Promise(async (resolve, reject) => {
        let userCart = await CartModel.findOne({ userId: user.email })
        // let product = await Addproduct.findOne({ productId: data.productId })


        if (userCart && userCart.product.length != 0) {
            const products = userCart.product

            let discount = 0
            for (let i = 0; i < products.length; i++) {
                discount += products[i].discount

            }
            console.log(discount);
            const discountedprice = userCart.total - discount
            await CartModel.findOneAndUpdate({ userId: user.email }, { $set: { totalAfterDiscount: discountedprice } })

            console.log(discountedprice, "its disc");

            resolve({ discountedprice, discount })
        } else {
            resolve()
        }

    })

}

const changecartQuantity = (data,Id)=>{
   console.log(data,"data");
   console.log(Id,"its id top");
data.count = parseInt(data.count)
return new Promise(async(resolve,reject)=>{
    if(data.qty <=1 && data.count == -1){
        console.log("if 1");
        return resolve({quantity:0})
    }
    const cart = await CartModel.findOne({userId: Id.email})
    console.log(cart,"its cart");
    const product = await Addproduct.findOne({_id:data.product})
    if(cart){
        console.log("if 2");
        if(data.qty>=product.stock && data.count){
            console.log("if3");
            console.log('out of stock');
            resolve({error: "out of stock"})
        }else{
            console.log("loop exist");
            console.log(Id,"its id last");  
            
            await CartModel.updateOne({userId:Id.email,'product.productId':data.product},{$inc:{'product.$.quantity':data.count}})
            return resolve({count:data.count})
        }
    }
})
}

/*---adress submit --*/

const submitAddress = (data, user) => {

    return new Promise(async (resolve, reject) => {
      console.log(user,"userrrrrrrr");
        let isUser = await userModel.findOne({ email: user.email })
        if (isUser) {
            await userModel.findOneAndUpdate({ email: user.email }, {
                name: data.firstname,
                number: data.phonenumber,
                useraddress: {
                    // firstName: data.firstname,
                    lastName: data.lastname,
                    phoneNumber: data.phonenumber,
                    counrty: data.countryName,
                    village: data.village,
                    // companyName: data.countryName,
                    // houseName: data.houseName,
                    // landMark: data.landmark,
                    // district: data.districts,
                    // city: data.city,
                    // postal: data.zip,
                    // status: data.home

                }

            }, { upsert: true })




            let exitAddress = await AddressModel.findOne({ userId: user.email })

            console.log(exitAddress,"exitttt");
            if (exitAddress) {
                await AddressModel.findOneAndUpdate(
                    { userId: user.email },
                    {
                        $push: {
                            address: {
                                firstName: data.firstname,
                                lastName: data.lastname,
                                phoneNumber: data.phonenumber,
                                counrty: data.countryName,
                                village: data.village,
                                companyName: data.countryName,
                                houseName: data.houseName,
                                landMark: data.landmark,
                                district: data.districts,
                                city: data.city,
                                postal: data.zip,
                                status: data.home

                            },
                        },
                    })
                resolve();
            } else {
                let updateAddress = new AddressModel({
                    userId: user.email,
                    address: {
                        firstName: data.firstname,
                        lastName: data.lastname,
                        phoneNumber: data.phonenumber,
                        counrty: data.countryName,
                        companyName: data.company,
                        village: data.village,
                        houseName: data.houseName,
                        landMark: data.landmark,
                        district: data.districts,
                        city: data.city,
                        postal: data.zip,
                        status: data.home

                    },
                })
                updateAddress.save(async (err, result) => {
                    if (err) {
                        reject({ msg: "addresss is not added" })
                    } else {
                        resolve({ msg: "adrees is added" })
                    }
                })
            }
        }
    })
}

const findAddress = (id, data) => {

    return new Promise(async (resolve, reject) => {
        let uniqaddress = await AddressModel.findOne({ userId: data.email }).lean()
        uniqaddress.address.map((e) => {
            if (e._id == id) {
                resolve(e)
            }
        })
    })
}

const getAddress = (data) => {
    return new Promise(async (resolve, reject) => {
        const findAdress = await AddressModel.findOne({ userId: data.email }).lean()
        resolve(findAdress)
    })
}




const finduser = (data) => {
    return new Promise(async (resolve, reject) => {
        const user = await userModel.findOne({email:data.email}).lean()
        resolve(user)
    })
}



const placeOrder = (data, user) => {
    return new Promise(async (resolve, reject) => {
        let isCart = await CartModel.findOne({ userId: user.email })
        


        const proDetails = []

        isCart.product.forEach((pro) => {
            proDetails.push({
                ProductId: pro.productId,
                name: pro.name,
                price: pro.price,
                brand: pro.brand,
                image: pro.image,
                quantity: pro.quantity,
                subTotal: pro.subtotal,
                colour:pro.colour,
                discount:pro.discount,
                paymentType: data.paymentMethod
            })
        })


        let newOrder = await new orderModel({
            userId: user.email,
            product: proDetails,
            address: {
                firstName: data.firstName,
                lastName: data.lastname,
                phoneNumber: data.number,
                houseName: data.houseName,
                landMark: data.landmark,
                district: data.districts,
                city: data.city,
                postal: data.zip,
                paymentMethod: data.paymentMethod
            },
            Quantity: isCart.quantity,
            totalAmount: isCart.total,
            Totalafter_discount: isCart.totalAfterDiscount,

        })
        await newOrder.save(async (err, result) => {
            if (err) {
                console.log(err);
                reject({ msg: "somthing went wrong" })
            } else {
                let userOrder = await OrderModel.findOne({ userId: user.email })
                resolve(userOrder._id)
            }
        })

    })

}

const generateRazorpay = (orderId, user) => {
    return new Promise(async (resolve, rreject) => {
        let isCart = await CartModel.findOne({ userId: user.email })

        var options = {
            amount: isCart.totalAfterDiscount * 100,
            currency: "INR",
            receipt: "" + orderId
        };
        instance.orders.create(options, function (err, order) {

            if (err) {
                console.log(err);
            } else {
                console.log("New Order:", order);
                resolve(order)
            }

        })
    })
}

const verifyPayment = (data, user) => {

    return new Promise(async (resolve, reject) => {
        const crypto = require('crypto');
        let hmac = crypto.createHmac('sha256', 'hmt50bjLzxNzzJCsfjIX7pFx')
        hmac.update(data['payment[razorpay_order_id]'] + '|' + data['payment[razorpay_payment_id]'])

        hmac = hmac.digest('hex')

        if (hmac == data['payment[razorpay_signature]']) {

            let cart = await CartModel.findOneAndDelete({ userId: user.email })


            const a = await orderModel.findByIdAndUpdate({ _id: data['order[receipt]'] }, { $set: { 'product.$[].paid': 'payment is succesfull' } })

            resolve(response)
        } else {
            reject()
        }
    })
}

/*getting order */


const getOrderDetail = (data) => {
    return new Promise(async (resolve, reject) => {
        const findOrder = await orderModel.find({ userId: data.email }).lean()
     
        resolve(findOrder)
    })
}
// const getSingleproduct = (id,user) => {
//     return new Promise(async (resolve, reject) => {
//         console.log(id);
//         let findproduct = await orderModel.findOne({userId:user.email,"product._id":id}).lean()
//         console.log(findproduct,"finddddd");
//         resolve(findproduct)


//     })
// }

const getSingleproduct2 = (id,user) => {
    return new Promise(async (resolve, reject) => {
       
        let findpro = await orderModel.findOne({userId:user.email,"product._id":id}).lean()
        let obj = {};
        findpro.product.forEach((p) => {
            if(String(p._id) === String(id)){
                obj = p;
            }
        })
       
        resolve({obj,findpro})


    })
}

/* FROM ASNA */

const displayProducts = (id)=>{
    console.log(id,"its idddd");
    return new Promise(async(resolve, reject) => {
        const displaysubpro = await Addproduct.find({category:id}).lean()
       
        console.log(displaysubpro,"llllll");
        resolve(displaysubpro)
    })
}



const displaySubCat = (id)=>{
    return new Promise(async(resolve, reject) => {
        const displaysubCategory = await subcategory.find({category:id}).lean()
       
        console.log(displaysubCategory);
        resolve(displaysubCategory)
    })
}



/** for filtering by category */

 const getcategory = () => {
    return new Promise(async (resolve, reject) => {
        const displayCategory = await Category.find().lean()
        resolve(displayCategory)
        console.log(displayCategory);
    })
}


/*--- find sub cat from its model--*/


const findsubcategory = ()=>{
    return new Promise(async(resolve,reject)=>{
        let subcat = await subcategory.find().lean()
        resolve(subcat)
    })
}



/* for thank you page */


const getOrdersingleDetail = (user,id) => {
return new Promise(async (resolve, reject) => {
  let order = await orderModel.findOne({userId:user.email}).sort({_id: -1}).lean();
        resolve({order})
       
    })
}


/*--- cancel order  --*/
const cancelYourOrder = async(id,user)=>{
    return new Promise(async(resolve,reject)=>{
        console.log(id,"from ajax");
        let users = await orderModel.findOne({userId:user.email})
        console.log(users,"userrr");
        users.product.forEach(async e=>{
          await   Addproduct.findOneAndUpdate({_id:e.productId},{$inc :{ stock: +e.quantity}})
        })
       
        await orderModel.findOneAndUpdate({userId:user.email,'product._id':id},{$set:{'product.$.status': 'order canceled'}})
        await orderModel.findOneAndUpdate({userId:user.email,'product._id':id},{$set:{'product.$.active': 'false'}})
        resolve()
    })
}

/*--delete order */

const  deleteYourOrder = (id,user)=>{
    return new Promise (async(resolve,reject)=>{
             await orderModel.findOneAndDelete({userId:user.email,'product._id':id})
             resolve()
    })
}

/*---Ssearch product --*/

const search=(data)=>{
    return new Promise(async(resolve,reject)=>{
      let search=data.search
      let products= await Addproduct.find({'$or':[{productName:{$regex:search,$options:'i'}}]}).lean()
        resolve(products)
    })
  }

module.exports = {
    dosignup,
    doLogin,
    forgetLoad,
    forgetVerify,
    forgetPasswordLoad,
    resetPassword,
    otpverify,
    featuredProduct,
    addingToCart,
    cartItems,
    deletingCart,
    productShow,
    getCartCount,
    subTotal,
    totalAmount,
    discount,
    addingTofavourte,
    getFavCount,
    favItems,
    deletingFavourites,
    submitAddress,
    getAddress,
    finduser,
    findAddress,
    placeOrder,
    generateRazorpay,
    verifyPayment,
    getOrderDetail,
    getSingleproduct2,
    cancelYourOrder,
    deleteYourOrder,
    search,
    getOrdersingleDetail,
    findsubcategory,
    getcategory,
    displaySubCat,
    displayProducts,
    changecartQuantity



}