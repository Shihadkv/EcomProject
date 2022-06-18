//  const { response } = require("../../app")

// const { response } = require("../../app")



function addingToCart(productId){
    $.ajax({
        url:'/AddtoCart/'+ productId,
        method:'get',
        success:(response)=>{
            if(response.status){
                 $("#cart-count").html(response.count)
                 swal({
                    title: "Good!",
                    text: "Added to the Cart!",
                    icon: "success",
                    button: "Ok!",
                  });
            }
            else{
                swal("Please Login!");
            } 
        }
    })
}


function addingTofav(productId){
    $.ajax({
        url:'/AddtoFav/'+ productId,
        method:'get',
        success:(response)=>{
            if(response.status){
                 $("#fav-count").html(response.count)
                 swal({
                    title: "Good!",
                    text: "Added to the Cart!",
                    icon: "success",
                    button: "Ok!",
                  });
            }
            else{
                swal("Please Login!");
            } 
        }
    })
}

function deletingCarts(productId){
    $.ajax({
        url:'/deleteCart/'+ productId,
        method:'get',
        success:(response)=>{
            if(response.status){
                 $("#cart-count").html(response.count)
                 alert('Item is removed from cart')
                 location.reload()
            }
            else{
                swal("Please Login!");
            } 
        }
    })
}

function deleteItem(productId) {
    if (confirm("Are you sure?")) {
        deletingCarts(productId)
    }
    return false;
}

function decrimentProduct(proId,quantity){
    $.ajax({
       
        url:'/decriment-product',
        data:{
            productId:proId,
            quantities:quantity
        },
        method:'post',
        success:(response)=>{
            var x = document.getElementById('numform').value;
            if(response){
                 location.reload()
                 
                document.getElementById('numform').innerHTML=x+1
            }
        }

    })
}


function incrementProduct(proId,quantity){
    
    $.ajax({
       
        url:'/increment-product',
        data:{
            productId:proId,
            quantities:quantity
        },
        method:'post',
        success:(response)=>{
            var x = document.getElementById('numform').value;
            if(response){
                location.reload()
                document.getElementById('numform').innerHTML=x+1
            }
        }

    })
}


// function changeQuantity(proId,qty,count){
//     $.ajax({
//         url:'/change-product-quantity',
//         data:{
            
//             product:proId,
//             qty:qty,
//             count:count
//         },
//         method:'post',
//         success:(response)=>{
//             if(response.count){
//                 $("#qty").load("qty");
//             }else if(response.quantity == 0){

//             }else{
//                 alert("out of stockss")
//             }
//         }


//     })
// }

$("#checkoutform").submit((e)=>{
    e.preventDefault()
    // console.log("fazzazazaz");
    $.ajax({
        url:'/checkout',
        method:'post',
        data:$('#checkoutform').serialize(),
        success:(response)=>{
            if(response.status){
               window.location.href='/thankyou'
            }else{
                console.log(response.response);
                razorpayPayment(response.response)

            }
            
        }

    })
})

function  razorpayPayment(order){
    console.log(order.amount,"its amount");
    var options = {
        
        "key": "rzp_test_jwEdfqWnIlISam", // Enter the Key ID generated from the Dashboard
        "amount": order.amount*100, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
        "currency": "INR",
        "name": "Myshoppie",
        "description": "Test Transaction",
        "image": "https://example.com/your_logo",
        "order_id": order.id, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
        "handler": function (response){
            alert(response.razorpay_payment_id);
            
            alert(response.razorpay_order_id);
            alert(response.razorpay_signature)

            verifyPayment(response,order)
        },
        "prefill": {
            "name": "Gaurav Kumar",
            "email": "gaurav.kumar@example.com",
            "contact": "9999999999"
        },
        "notes": {
            "address": "Razorpay Corporate Office"
        },
        "theme": {
            "color": "#3399cc"
        }
    };
    var rzp1 = new Razorpay(options);
    rzp1.open();
    // rzp1.on('payment.failed', function (response){
    //         alert(response.error.code);
    //         alert(response.error.description);
    //         alert(response.error.source);
    //         alert(response.error.step);
    //         alert(response.error.reason);
    //         alert(response.error.metadata.order_id);
    //         alert(response.error.metadata.payment_id);
    // });
    // document.getElementById('rzp-button1').onclick = function(e){
       
    //     e.preventDefault();
    // }
}

function verifyPayment(payment,order){
    
    $.ajax({
        url:'/verifypayment',
        data:{
            payment,
            order
        },
        method:"post",
        success:(response)=>{
        //    if(response.status)
        swal("online payment is succesfull");
        }
    })
}


function deletingFav(productId){
    $.ajax({
        
        url:'/deleteFav/'+ productId,
        method:'get',
        success:(response)=>{
            console.log("rooohithhhh");
            if(response.status){
                 $("#fav-count").html(response.count)
                 alert('Item is removed from fav')
                 location.reload()
            }
            else{
                alert('please login')
            } 
        }
    })
}

function deletefav(productId) {
    if (confirm("Are you sure?")) {
        deletingFav(productId)
    }
    return false;
}

function getAll(proId){
    let parent = document.getElementById("parent");
    console.log(parent, "parent")
    parent.innerHTML="";
    $.ajax({
        url:'/users/getAll/'+proId,
        method:'get',
        success:(response)=>{
           let product=response.product;
          console.log(product, "product");
          product.forEach((p,i) => {
            let div = document.createElement('div')
            let parentDiv =document.createElement('div')
            parentDiv.setAttribute("class",
            "col-sm-12 col-md-4")
            let proName = document.createElement('h6')
                let prodImg = document.createElement("img");
            prodImg.src= `/uploads/${p.images[0].img1}`;
            prodImg.alt=p.brand;
            proName=p.productName
            parentDiv.append(prodImg);
            parentDiv.append(proName);
            parent.append(parentDiv);
            
          });
        }
    })
}

function cancel(id){
    if(confirm('are you sure')){
        canceling(id)
    }
}

function canceling(id){
    console.log(id,'its id');
    $.ajax({
        url:'/cancelorder/'+id,
        method:'get',
        success:(response)=>{
            location.reload()
        }
    })
}

function deleteOrder(id){
    if(confirm('are you sure')){
        deleting(id)
    }
}

function deleting(id){
    console.log(id,'its id');
    $.ajax({
        url:'/deleteOrder/'+id,
        method:'get',
        success:(response)=>{
            location.reload()
        }
    })
}


/*---- change order status ---*/


    function changeStatus(id,user){
        console.log(id,"iddd");
        console.log(user,"userrr");
        let data = document.getElementById('orderStatus').value
        console.log(data,"from ajax");
   
        $.ajax({
            url:'/admin/changeStatus',
            data:{
                id,
                user,
                data
            },
            method :'post',
            succes:(response)=>{
                location.reload()
                console.log('success')
            }
        })
    }