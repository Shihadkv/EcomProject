const { reject } = require('bcrypt/promises')
const async = require('hbs/lib/async')
const Addproduct = require('../model/product')
const { path, response } = require('../app')
const AdminLog = require('../model/adminlogin')
const Category = require('../model/category')
const BrandModel = require('../model/brand')
const subcategory = require('../model/subcategory')
const userModel = require('../model/userModel')
const orderModel = require('../model/order')
const { doLogin } = require('./userHelper')






module.exports = {

    uploadFiles: (products, img1, img2) => {
        return new Promise(async (resolve, reject) => {

            const subcategories = await subcategory.findOne({ name: products.subcategory })
            const brands = await BrandModel.findOne({ name: products.brand })
            const categories = await Category.findOne({ name: products.category })

            if (!img2) {
                reject({ msg: "do upload" })
            }
            else {
                let productUpload = await new Addproduct({
                    images: { img1, img2 },
                    name: products.name,
                    productName: products.pname,
                    companyName: products.cname,
                    price: products.price,
                    discountprice: products.discountprice,
                    colour: products.colrname,
                    description: products.description,
                    stock: products.stock,
                    category: categories._id,
                    subcategory: subcategories._id,
                    brand: brands._id,


                })
                await productUpload.save((err, result) => {
                    if (err) {
                        console.log(err);
                    } else {
                        resolve({ products: result, msg: "success" })
                    }
                })
            }
        })
    },
    deleteProducts: (proId) => {
        return new Promise((resolve, reject) => {
            Addproduct.deleteOne({ _id: proId }).then((response) => {
                console.log(response);
                resolve(response)
            })
        })
    },
    getProductdetails: (proId) => {
        return new Promise(async (resolve, reject) => {
            let products = await Addproduct.findOne({ _id: proId }).lean().populate('category')
            resolve(products)
        })

    },
    updateProduct: (proId, products) => {
        return new Promise(async (resolve, reject) => {
            await Addproduct.findByIdAndUpdate(proId, products)
                .then((response) => {
                    resolve()
                })
        });
    },
    viewProducts: () => {
        return new Promise((resolve, reject) => {
            Addproduct.find().lean().populate('category').then((products) => {
                resolve(products)
            })
        })
    },

    adminLogin: (data) => {
        return new Promise(async (resolve, reject) => {
            const admin = await AdminLog.findOne({ email: data.email })
            console.log(admin);
            if (admin) {
                if (data.password == admin.password) {
                    resolve({ status: true, msge: "login success" })
                } else {
                    reject({ status: false, err: "password incorrect" })
                }
            } else {
                console.log('login failed');
                reject({ status: false })
            }
        })
    },

    addCategory: (data) => {
        console.log(data);
        return new Promise(async (resolve, reject) => {
            let categoryName = await Category.findOne({ name: data.category })
            if (categoryName) {
                reject({ status: false, msg: "All ready exitsting category" })
            } else {
                let uploadCategories = new Category({
                    name: data.category
                })
                console.log(uploadCategories);
                await uploadCategories.save((err, result) => {
                    if (err) {
                        reject({ status: false, msg: "category is not added" })
                    } else {
                        resolve({ result, msg: "category is added" })
                    }
                })
            }
        })
    },

    addsubCategory: (data) => {
        console.log(data);
        return new Promise(async (resolve, reject) => {
            let category = await Category.findOne({ name: data.category })

            /*here the category:category is the category that w passed on subcatgry */
            let uploadsubCategories = new subcategory({
                name: data.subcategory,
                category: category._id

            })
            console.log(uploadsubCategories);
            await uploadsubCategories.save().then((error, result) => {
                if (error) {
                    reject({ status: false, msg: "Subcategory is not added" })
                } else {
                    console.log(result);
                    resolve({ result, msg: "Subcategory is added" })
                }
            })
        })

    },
    showcategory: () => {
        return new Promise(async (resolve, reject) => {
            const category = await Category.find({}).lean()
            resolve(category)
        })
    },
    getsubCategory: () => {
        return new Promise(async (resolve, reject) => {
            const displayCategory = await subcategory.find().lean()
            resolve(displayCategory)
            console.log(displayCategory);
        })
    },

    getcategory: () => {
        return new Promise(async (resolve, reject) => {
            const displayCategory = await Category.find().lean()
            resolve(displayCategory)
            console.log(displayCategory);
        })
    },

    addBrand: (data) => {

        return new Promise(async (resolve, reject) => {
            let BrandName = await BrandModel.findOne({ name: data.brand })
            console.log(BrandName);
            if (BrandName) {
                reject({ status: false, msg: "All ready exitsting brand" })
            } else {
                let uploadBrand = new BrandModel({
                    name: data.brand
                })

                await uploadBrand.save((err, result) => {
                    if (err) {
                        reject({ status: false, msg: "brand is not added" })
                    } else {
                        resolve({ result, msg: "brand is added" })
                    }
                })
            }
        })
    },
    getbrand: () => {
        return new Promise(async (resolve, reject) => {
            const displayBrand = await BrandModel.find().lean()
            resolve(displayBrand)

        })
    },

    /*  block user */

    blockuser: (data) => {

        return new Promise(async (resolve, reject) => {
            const user = await userModel.findOneAndUpdate({ email: data }, { $set: { status: false } })
            resolve()
        })
    },

    unblockuser: (data) => {
        return new Promise(async (resolve, reject) => {

            const user = await userModel.findOneAndUpdate({ email: data }, { $set: { status: true } })
            resolve()
        })
    },

    /*--- bellow are order functions--*/

    getOrderDetail: () => {
        return new Promise(async (resolve, reject) => {
            let findOrder = await orderModel.find({}).lean()

            resolve(findOrder)
        })
    },
    /*-- get single order details of one product --*/

    getSingleProduct: (id, user) => {
        console.log(id);
        console.log(user, "userr");
        return new Promise(async (resolve, reject) => {
            let singleProduct = await orderModel.findOne({ userId: user, "product._id": id }).lean()
            console.log(singleProduct, "jjjjjjjj");
            let obj = {};
            singleProduct.product.forEach((p) => {
                if (String(p._id) === String(id)) {
                    obj = p;
                }
            })

            resolve({ obj, singleProduct })
        })
    },


    /*---change order status --*/

    changestatus: (data) => {
        console.log(data);
        return new Promise(async (resolve, reject) => {
            if (data.data == 1) {
                await orderModel.findOneAndUpdate({ userId: data.user, "product._id": data.id }, { 'product.$.status': 'shipped' })
                resolve()
            } else {
                await orderModel.findOneAndUpdate({ userId: data.user, "product._id": data.id }, { 'product.$.status': 'Delivered' })
                resolve()
            }
        })
    }

}


