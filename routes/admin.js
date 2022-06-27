var express = require('express');
var router = express.Router();
var userModel = require('../model/userModel')
const adminHelper = require('../helpers/adminHelper')
const storage = require('../middlwre/multer')
var product = require('../model/product');
// var Category = require('../model/category')
const { uploadFiles } = require('../helpers/adminHelper');
const async = require('hbs/lib/async');
const { response, render } = require('../app');
const orderModel = require('../model/order');
const moment =  require('moment');



// const upload = require('express-fileupload');

/* GET users listing. */


const verifyLoginadmin = (req, res, next) => {
  if (req.session.adminlogged) {
    next()
  } else {
    res.redirect('/admin/adminLogin')
  }
}

router.get('/',verifyLoginadmin, async function (req, res, next) {
   res.header('Cache-control', 'no-cache,private, no-store, must-revalidate,max-stale=0,post-check=0,pre-check=0');
  admin = req.session.adminlogged
   if(req.session.adminlogged){

   let Total = await adminHelper.grandTotal()
   console.log(Total);
   let order = await adminHelper.getAllorder()
   console.log(order);
   let users = await adminHelper.getAllusers()
   console.log(users);
  

    res.render('admin/adminhome',{admin,Total,order,users})

   }
   else{
     res.render('admin/adminLogin')
   }
});
router.get('/userInfo',verifyLoginadmin,(req,res)=>{
  userModel.find({}).lean().then((result)=>{
    const alert = req.flash('msg')
    console.log(alert);
    res.render('admin/userInfo',{result,alert})
  })
})

/*---- block user --*/

router.get('/blockUser/:id',(req,res)=>{
  console.log(req.params.id);
   adminHelper.blockuser(req.params.id).then(()=>{
   req.flash('msg', 'You blocked succesfully!')
    res.redirect('/admin/userInfo')
  })
})

/*---- unblock user --*/

router.get('/unBlockUser/:id',(req,res)=>{
adminHelper.unblockuser(req.params.id).then(()=>{
  req.flash('msg', 'You unblocked successfully!')
    res.redirect('/admin/userInfo')
  })
})



router.get('/addProduct',verifyLoginadmin,async(req,res)=>{
  try{
    admin = req.session.admin
    const subcat  = await adminHelper.getsubCategory()
    const brand = await adminHelper.getbrand()
    const category = await adminHelper.getcategory()
    console.log(category);
    res.render('admin/addProduct',{admin:true,subcat,brand,category})
  } catch(error){
    console.log(error.message);
  }
  
})


/*----- order info---*/

router.get('/orderInfo',verifyLoginadmin,async(req,res)=>{
  const order = await adminHelper.getOrderDetail()

      // let date = moment(order.modifiedOn).format("YYYY/MM/DD");
      // let time = moment(order.modifiedOn).format("HH:mm:ss");
      // console.log(date,"its dateee");
      // order.date=date
  res.render('admin/orderInfo',{order})
})


/*---view single order--*/

router.get('/viewSingleorder/:id/:id2',verifyLoginadmin,async(req,res)=>{

  let id =  req.params.id
  let user = req.params.id2
 
 await adminHelper.getSingleProduct(id,user).then((result)=>{


  res.render('admin/viewSingleorder',{result})
 })
})

/*---change order status--*/

router.post('/changeStatus',async(req,res)=>{
  console.log(req.body);
  await adminHelper.changestatus(req.body).then(()=>{
    res.json({status:true})
  })
})

router.post('/addProduct', storage.fields([{name:"images1",maxCount:1},{name:"images2",maxCount:1}]),async(req,res)=>{
  let img1 = req.files.images1[0].filename
  let img2 = req.files.images2[0].filename
  console.log(img1,img2);
  const  files = req.files.filename;
 adminHelper.uploadFiles(req.body,img1,img2).then((data)=>{
   res.redirect('/admin')
 })
})
router.get('/adminLogin',(req,res)=>{
  res.render('admin/adminLogin')
})

router.post('/adminLogin', (req, res) => {
  res.header('Cache-control', 'no-cache,private, no-store, must-revalidate,max-stale=0,post-check=0,pre-check=0');
  adminHelper.adminLogin(req.body).then((response) => {
    console.log(response);
            req.session.adminlogged =true
            res.redirect('/admin')
  }).catch((err)=>{
    console.log(err);
  })
})



router.get('/viewProduct',verifyLoginadmin,(req,res)=>{
  adminHelper.viewProducts().then((products)=>{
     res.render('admin/viewProduct',{products})
  })
})

router.get("/deleteproduct/:id",(req,res)=>{
  let proId=req.params.id
  adminHelper.deleteProducts(proId).then((response)=>{
    res.redirect('/admin/viewProduct')
  })
})


router.get("/editProduct/:id",verifyLoginadmin,async(req,res)=>{
   let products = await adminHelper.getProductdetails(req.params.id)
  res.render('admin/editProduct',{products})

})

router.post("/editProduct/:id" ,storage.fields([{name:"images1",maxCount:1},{name:"images2",maxCount:1}]),async (req,res, next)=>{
  const {id} = req.params;
  try{
    const products = await product.findById(id);
    console.log(products, "products");
    let img1 = req.files.images1 ? req.files.images1[0].filename : products.images[0].img1;
    let img2 = req.files.images2 ? req.files.images2[0].filename : products.images[0].img2;
    req.body.images = [];
    req.body.images.push({img1,img2});
   console.log(img1, img2)
       adminHelper.updateProduct(req.params.id,req.body).then(()=>{
         res.redirect('/admin/viewProduct')
       })
  }catch(err){
    next(err);
  }
  
})

router.get('/adminCategory',verifyLoginadmin,async(req,res)=>{
  res.render('admin/adminCategory',{err:req.session.categoryError})
  req.session.categoryError = null
 
})


router.post('/adminCategory',(req,res)=>{
   adminHelper.addCategory(req.body).then((response)=>{
    res.redirect('/admin/adminCategory')
   }).catch((err)=>{
     console.log(err.msg);
     req.session.categoryError = err.msg
     res.redirect('/admin/adminCategory')
   })
})

router.get('/subCategory',verifyLoginadmin,async(req,res)=>{
  let category = await adminHelper.showcategory(req.params.id)
  res.render('admin/subCategory',{error:req.session.subCategoryError,category})
  req.session.subCategoryError = null
})

router.post('/subCategory',(req,res)=>{
     adminHelper.addsubCategory(req.body).then((result)=>{
       res.redirect('/admin/addProduct')
     }).catch((error)=>{
       console.log(error.msg);
       req.session.subCategoryError = error.msg
       res.redirect('/admin/adminCategory')
     })
})


/* brand */

router.get('/brand',verifyLoginadmin,(req,res)=>{
  res.render('admin/brand',{ err : req.session.brandError})
   req.session.brandError = null
})


router.post('/brand',(req,res)=>{
  adminHelper.addBrand(req.body).then((response)=>{
   res.redirect('/admin/brand')
  }).catch((err)=>{
    console.log(err.msg);
    req.session.brandError = err.msg
    console.log(req.session.brandError);
    res.redirect('/admin/brand')
  })
})




/**for salesss */


router.post('/getData',async(req,res)=>{
  console.log(req.body,'req.body');
   let {startDate,endDate} = req.body
 
   let d1, d2, text;
   if (!startDate || !endDate) {
       d1 = new Date();
       d1.setDate(d1.getDate() - 7);
       d2 = new Date();
       text = "For the Last 7 days";
     } else {
       d1 = new Date(startDate);
       d2 = new Date(endDate);
       text = `Between ${startDate} and ${endDate}`;
     }
  
 
 // Date wise sales report
 
 const date = new Date(Date.now());
 const month = date.toLocaleString("default", { month: "long" });
 let salesReport = await orderModel.aggregate([
 {
   $match: {
    modifiedOn: {
       $lt: d2,
       $gte: d1,
     },
   },
 },
 {
   $group: {
     _id: { $dayOfMonth: "$modifiedOn" },
     total: { $sum: "$Totalafter_discount" },
   },
 },
 ]);
 console.log(salesReport,'salesReport');
 
 let dateArray = [];
 let totalArray = [];
 salesReport.forEach((s) => {
 dateArray.push(`${month}-${s._id} `);
 totalArray.push(s.total);
 });
 
 let brandReport = await orderModel.aggregate([{
   $unwind: "$product",
 },{
   $project:{
       brand: "$product.brand",
       subTotal:"$product.subTotal"
   }
 },{
   $group:{
       _id:'$brand',
       Totalafter_discount: { $sum: "$subTotal" },
 
   }
 }
 
 ])
 console.log(brandReport,"report");
 
 let orderCount = await orderModel.find({modifiedOn:{$gt : d1, $lt : d2}}).count()
 console.log (orderCount,'orderCount');
 
 let Sales = 0;
 
 salesReport.map((t) => {
   Sales += t.total
 })
 
 console.log (Sales,'Sales');
 
 let success  = await orderModel.find({'product.paid':'payment completed'})
 let successPayment = 0;
 
 success.map((e)=>{
   successPayment += e.Totalafter_discount
 })
 
 let brandArray = [];
 let sumArray = [];
 brandReport.forEach((s) => {
 brandArray.push(s._id);
 sumArray.push(s.Totalafter_discount);
 });
 
 // let orderCount = await totalOrders() 
 // let Sales = await totalSales()
 // let successPayment = await paymentstatus()
 // let refund = Sales - successPayment
 
   res.json({dateArray,totalArray,brandArray,sumArray,orderCount,Sales,successPayment})
  })
 
 





router.get('/logout', (req, res) => {
  req.session.adminlogged = false
  req.session.destroy();
  console.log("distroy");
  res.redirect('/admin/adminLogin')
})



module.exports = router;
