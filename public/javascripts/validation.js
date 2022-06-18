$(document).ready(function(){
    $("#signup").validate({
        errorClass:"error",
     rules:{
        name:{
            required:true,
            minlength:4,
            maxlength:30,
            namevalidation:true
        },
         email:{
            required:true,
            email:true
        },
         password:{
            required:true,
            minlength:5
        },
       cnfmpassword:{
           required:true,
           equalTo:'#password'
       },
       
        number:{
            required:true,
            minlength:10,
            maxlength:10,
            number:true
        },
        address:{
            required:true,
            minlength:10,
            maxlength:10,
        },
       
       

       
        
     },
     messages:{
         name:{
             required:"Please enter your name",
             minlength:"At least 4 characters required",
             maxlength:"Maximum 15 characters are allowed"
         },
         email:{
             required:"Please enter your email id",
             email:"Enter a valid email"
         },
         
         
         number:{
            required:"Please enter your phone number",
            minlength:"Enter 10 numbers",
            maxlength:"Number should be less than or equal to 10 numbers",
            
           },
         
         password:"Please enter your password",
         address:"please enter your address",
         
        
     }
    })
    $.validator.addMethod("namevalidation", function(value, element) {
            return /^[a-zA-Z0-9_.-]+$/.test(value);
    },
      "Sorry,only alphabets are allowed"
   );

})


$(document).ready(function(){
    $("#userlogin").validate({
        errorClass:"error",
     rules:{
        name:{
            required:true,
            minlength:4,
            maxlength:15,
            namevalidation:true
        },
         email:{
            required:true,
            email:true
        },
         password:{
            required:true,
            minlength:3
        },
       cnfmpassword:{
           required:true,
           equalTo:'#password'
       },
       
        number:{
            required:true,
            minlength:10,
            maxlength:10,
            number:true
        },
        address:{
            required:true,
            minlength:10,
            maxlength:10,
        },
       
       

       
        
     },
     messages:{
         name:{
             required:"Please enter your name",
             minlength:"At least 4 characters required",
             maxlength:"Maximum 15 characters are allowed"
         },
         email:{
             required:"Please enter your email id",
             email:"Enter a valid email"
         },
         
         
         number:{
            required:"Please enter your phone number",
            minlength:"Enter 10 numbers",
            maxlength:"Number should be less than or equal to 10 numbers",
            
           },
         
         password:"Please enter your password",
         address:"please enter your address",
        
     }
    })
    $.validator.addMethod("namevalidation", function(value, element) {
            return /^[A-Za-z]+$/.test(value);
    },
      "Sorry,only alphabets are allowed"
   );
   
})


/// admin add product subcategory validator //


