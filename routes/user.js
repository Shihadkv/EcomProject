var express = require('express');
var router = express.Router();
const userHelper = require('../helpers/userHelper');
const userModel = require('../model/userModel')
const session = require('express-session');
var { doLogin, dosignup, forgetLoad, forgetPasswordLoad, otpverify, featuredProduct, addingToCart, cartItems, deletingCart, productShow, getCartCount, decrimentProducts, incrementsProducts, totalAmount, subTotal, discount, addingTofavourte, getFavCount, favItems, deletingFavourites, submitAddress, getAddress, finduser, findAddress, placeOrder, generateRazorpay, verifyPayment, getOrderDetail, getSingleproduct2, cancelYourOrder, deleteYourOrder, search, getOrdersingleDetail, findsubcategory, getcategory, displaySubCat, displayProducts, changecartQuantity } = require('../helpers/userHelper')
var jwt = require('jsonwebtoken');
const { response } = require('../app');
const async = require('hbs/lib/async');
const { generate } = require('randomstring');
const CartModel = require('../model/cart');
/* GET home page. */

const verifyLogin = (req, res, next) => {
  if (req.session.user) {
    next()
  } else {
    res.redirect('/login')
  }
}

/* Lanading page*/
router.get('/', async (req, res, next) => {

  user = req.session.user
  let cartCount = null
  let favcounts = null
  if (req.session.user) {
    cartCount = await getCartCount(req.session.user)
    favcounts = await getFavCount(req.session.user)
  }
  featuredProduct().then(async (data) => {
    res.render('user/userhome', { user, data, cartCount, favcounts, error: req.session.cartErr });
  })

});
router.get('/login', (req, res) => {
  res.header('Cache-control', 'no-cache,private, no-store, must-revalidate,max-stale=0,post-check=0,pre-check=0');
  if (req.session.loggedIn) {
    res.redirect('/')
  } else {

    res.render('user/login', { error: req.session.logginErr })
    req.session.logginErr = null;
  }
})


router.post('/login', (req, res) => {
  doLogin(req.body).then((user) => {
    req.session.user = user
    req.session.loggedIn = true;

    console.log(req.session.user);
    res.redirect('/')

  })
    .catch((error) => {
      req.session.logginErr = error.msg
      res.redirect('/login')
    })
})


router.get('/signup', (req, res) => {
  
  res.render('user/signup',{error: req.session.signeupErr})
})


router.get('/AddtoCart/:id', verifyLogin, (req, res) => {
  id = req.params.id
  // console.log(req.session.user);
  console.log(id)

  addingToCart(id, req.session.user).then(() => {
    getCartCount(req.session.user).then((count) => {
      res.json({ status: true, count })
    })

  }).catch((error) => {
    req.session.cartErr = error.msg
    console.log(error.msg);
    res.redirect('/')
  })
})



/*--favorites---*/

router.get('/AddtoFav/:id', verifyLogin, (req, res) => {
  id = req.params.id
  // console.log(req.session.user);
  console.log(id)

  addingTofavourte(id, req.session.user).then(() => {
    getFavCount(req.session.user).then((count) => {
      res.json({ status: true, count })
    })

  }).catch((error) => {
    req.session.cartErr = error.msg
    console.log(error.msg);
    res.redirect('/')
  })
})


router.get('/favourites', verifyLogin, async (req, res) => {
  let data = await favItems(req.session.user)
  let favcounts = await getFavCount(req.session.user)
  cartCount = await getCartCount(req.session.user)
  user = req.session.user
  //  let total = await totalAmount(req.session.user)
  //  let subtotal = await subTotal(req.session.user)
  //  let discounts = await discount(req.session.user)
  if (data) {
    let product = data.product
    // console.log(product);
    res.render('user/favourites', {user,product, favcounts, cartCount })
  } else {
    res.render('user/favourites')
  }
})

router.get('/deleteFav/:id', (req, res) => {
  deletingFavourites(req.params.id, req.session.user).then(() => {
    res.json({ status: true })
  })
})


/*---order page */
router.get('/orders', verifyLogin, (req, res) => {
  user = req.session.user
  getOrderDetail(req.session.user).then((order) => {
    console.log(order);
    res.render('user/orders', { user,order })
  })

})

/* view order */
router.get('/vieworder/:id', verifyLogin, (req, res) => {
  user = req.session.user
  getSingleproduct2(req.params.id, req.session.user).then((single) => {
    console.log(single, "single");

    res.render('user/vieworder', { user,single })

  })

})


/*-- thank you page --*/


router.get('/thankyou', async (req, res) => {
  await getOrdersingleDetail(req.session.user, req.params.id).then((singleOrder) => {
    console.log(singleOrder, "order");
    res.render('user/thankyou', { singleOrder })
  })
})




/*---cancel order---*/

router.get('/cancelorder/:id', (req, res) => {
  cancelYourOrder(req.params.id, req.session.user).then(() => {
    res.json({ status: true })
  })
})


/*-- delete order--*/


router.get('/deleteOrder/:id', (req, res) => {
  console.log("iddididiididid");
  deleteYourOrder(req.params.id, req.session.user).then(() => {
    res.json({ status: true })
  })
})

/* sub cat */


router.get('/getsubcategory/:id' ,verifyLogin, async (req, res) => {
  let response = await displaySubCat(req.params.id)
  let products = await displayProducts(req.params.id)
  console.log(products, "its product");
  res.render('user/getsubcategory', { response, products })

})


/* from ashna */







/*-----categry page ---*/



router.get('/category', verifyLogin, async (req, res) => {
  user = req.session.user
  featuredProduct().then(async (data) => {
    let subcategory = await findsubcategory()
    let category = await getcategory()

    res.render('user/category', { data,user,subcategory, category });
  })
})


/*----userprofile---*/

router.get('/userprofile', verifyLogin, async (req, res) => {
  let user = await finduser(req.session.user)
  res.render('user/userprofile', { user })
})
router.post('/userprofile', (req, res) => {
  submitAddress(req.body, req.session.user)
  res.redirect('/cart')

})


router.get('/AddressSub', verifyLogin, async (req, res) => {
  user = req.session.user
  let useradres = await getAddress(req.session.user)

  if (useradres) {
    res.render('user/AddressSub', {user,useradres })

  } else {
    res.redirect('/userprofile')
  }

})


router.post('/AddressSub', verifyLogin, (req, res) => {
  submitAddress(req.body, req.session.user).then(() => {
    res.redirect('/AddressSub')
  })
})




/*---seerach product--*/

router.post('/category', async (req, res) => {
  if (req.session.user) {
    let count = await getCartCount(req.session.user)
    let favcounts = await getFavCount(req.session.user)
    let user = req.session.user
    search(req.body).then((data) => {
      res.render('user/category', { count, favcounts, data })
    })
  } else {
    search(req.body).then((data) => {
      res.render('user/category', { data })
    })
  }
})




/*--checkout--*/

router.get('/checkout/:id', verifyLogin, async (req, res) => {
  let id = req.params.id
  user = req.session.user
  let data = await cartItems(req.session.user)
  let cartCount = await getCartCount(req.session.user)
  let total = await totalAmount(req.session.user)
  let subtotal = await subTotal(req.session.user)
  let discounts = await discount(req.session.user)


  findAddress(id, req.session.user).then((address) => {
    res.render('user/checkout', { address,user,cartCount, data, total, subtotal, discounts })
    // res.json({status:true})

  })
})


router.post('/checkout', async (req, res) => {
  placeOrder(req.body, req.session.user).then(async (userOrderId) => {

    if (req.body.paymentMethod === 'COD') {
      await CartModel.findOneAndDelete({ userId: req.session.user.email })
      res.json({ status: true })
    } else {
      generateRazorpay(userOrderId, req.session.user).then((response) => {
        console.log(response, "its from generet");
        res.json({ response })
      })
    }

  }).catch((err) => {
    req.session.paymenterr = err.msg
    res.render('user/checkout', { error: req.session.paymenterr })
  })

})

/*----from razorpay payment--*/

router.post('/verifypayment', (req, res) => {

  verifyPayment(req.body, req.session.user).then((response) => {

    console.log("srruu");
    res.json({ status: true })

  }).catch((err) => {
    res.json({ status: false, errMsg: '' })
  })
})




router.get('/productShow/:id', async (req, res) => {
  user = req.session.user
  // favCounts = await getFavCount(req.session.user)
  productShow(req.params.id).then((response) => {

    res.render('user/productShow', { user,response})
  }).catch((err) => {
    res.redirect('/')
  })
})



router.get('/cart', verifyLogin, async (req, res) => {
  user = req.session.user
  let subtotal = await subTotal(req.session.user)
  let total = await totalAmount(req.session.user)
  let data = await cartItems(req.session.user)
  cartCount = await getCartCount(req.session.user)
  favCounts = await getFavCount(req.session.user)

  let discounts = await discount(req.session.user)
  

  if (data) {
    let product = data.product


    res.render('user/cart', {user,product, cartCount, favCounts, data, total, subtotal, discounts })
  } else {
    res.render('user/cart', { cartCount, favCounts, discounts })
  }

  // res.render('user/cart', {  product,cartCount, favCounts, data, total, empty,subtotal, discounts })
  // if (data) {
  //   let product = data.product


  //   res.render('user/cart', { product, cartCount, favCounts, data, total, subtotal, discounts })
  // } else {
  //   let product = data.product ? data.product : [];

  //   res.render('user/cart', { product, cartCount, total,subtotal,favCounts, data, discounts })
  // }



})


router.get('/deleteCart/:id', (req, res) => {
  deletingCart(req.params.id, req.session.user).then(() => {
    res.json({ status: true })
  })
})


router.post('/change-product-quantity', (req, res) => {
  changecartQuantity(req.body, req.session.user).then((response) => {
    res.json(response)
  })


})

// router.post('/decriment-product', (req, res) => {
//   decrimentProducts(req.body, req.session.user).then(() => {
//     res.json({ status: true })
//   })
// })

// router.post('/increment-product', (req, res) => {
//   incrementsProducts(req.body, req.session.user).then(() => {
//     res.json({ status: true })
//   })
// })


router.get('/cart', verifyLogin, async (req, res) => {
  let total = totalAmount(req.session.user)
  console.log(total);
})



router.get('/forgetpswd', userHelper.forgetLoad)


router.post('/forgetpswd', userHelper.forgetVerify)

router.get('/resetpswd', userHelper.forgetPasswordLoad)

router.post('/resetpswd', userHelper.resetPassword)

router.post('/signup', (req, res) => {
  console.log("kokokokokoooiii");
  dosignup(req.body).then((response) => {
    req.session.user = req.body
    req.session.userEmail = req.body.email
    console.log(req.session.userEmail);
    req.session.otp = response.otpCode
    console.log(req.session.otp);
    res.redirect('/verification')
  })
    .catch(() => {
      req.session.signupErr = error.msg
      res.redirect('/signup')
    })
})

router.get('/verification', (req, res) => {
  console.log('hiiii');
  const data = req.session.userEmail
  res.render('user/verification', { data })
})

router.post('/verification', (req, res) => {
  otpverify(req.body, req.session.otp, req.session.user).then((response) => {
    console.log(response, "its response");
    res.redirect('/login')
  }).catch((error) => {
    console.log(error.msg);
    // otpErr=error.msg
    res.redirect('/verification')
  })
})



router.get('/logout', (req, res) => {
  req.session.loggedIn = false
 
  res.redirect('/')
})
module.exports = router;

