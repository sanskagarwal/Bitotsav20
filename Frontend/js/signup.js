let url = "https://bitotsav.in/api/auth";

function SiForm(){
    $('#SSS').hide();
    $('#SS').show();
}

function signupForm() {

    var thisAlert = $('#suemail').parent();
    $(thisAlert).removeClass('alert-validate');
    var thisAlert = $('#suemail').parent();
    $(thisAlert).removeClass('alert-validate1');
    var thisAlert = $('#sumobile').parent();
    $(thisAlert).removeClass('alert-validate');
    var thisAlert = $('#supassword').parent();
    $(thisAlert).removeClass('alert-validate');
    var thisAlert = $('#supassword').parent();
    $(thisAlert).removeClass('alert-validate1');
    var thisAlert = $('#sucpassword').parent();
    $(thisAlert).removeClass('alert-validate');


    let email = $('#suemail').val().trim();
    let mobile= $('#sumobile').val().trim();
    let password = $('#supassword').val();
    let confirmPassword = $('#sucpassword').val();

    
    var emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
     if(email==="")
     { 
       var thisAlert = $('#suemail').parent();
       $(thisAlert).addClass('alert-validate');
       return;
     }
     if(emailReg.test(email)==false)
     {
        var thisAlert = $('#suemail').parent();
        $(thisAlert).addClass('alert-validate1');
        return;
     }
     
     if (mobile === "") {
        var thisAlert = $('#sumobile').parent();
        $(thisAlert).addClass('alert-validate');
        return;
      }
    if (mobile.length !== 10) {
        var thisAlert = $('#sumobile').parent();
        $(thisAlert).addClass('alert-validate');
        return;
    }
    if (isNaN(mobile)) {
        var thisAlert = $('#sumobile').parent();
        $(thisAlert).addClass('alert-validate');
        return;
    }
    if(password===""){
        var thisAlert = $('#supassword').parent();
        $(thisAlert).addClass('alert-validate');
        return;
    }
    if(password.length<6){
        var thisAlert = $('#supassword').parent();
        $(thisAlert).addClass('alert-validate1');
        return;
    }

     if (confirmPassword !== password) {
        var thisAlert = $('#sucpassword').parent();
         $(thisAlert).addClass('alert-validate');
        return;
    }

    $("#btnSignUp").attr("disabled", true);
    $('.rotator').addClass('spinner');

    grecaptcha.ready(function () {
        grecaptcha.execute('6LdPBsgUAAAAAPMm-Lao4qSFeiQXuX1hDibxnJNZ', { action: 'signup' }).then(function (tokenn) {
            $.ajax({
                url: url + "/register",
                method: "POST",
                data: {
                    email: email,
                    phoneNo: mobile,
                    password: password,
                    confPassword: confirmPassword,
                    captchaToken: tokenn
                },
                crossDomain: true,
                success: function (res) {
                    $('.rotator').removeClass('spinner');

                    if (res.status !== 200) {
                        $("#errMsg").text(res.message);
                        $("#btnSignUp").attr("disabled", false);
                    }
                    else if (res.status === 200) {
                        if (res.isVerified === false) {
                            localStorage.setItem("token", res.token);
                            $("#errMsg").css({ color: "green" });
                            $("#errMsg").text("Successfully Registered");
                            setTimeout(function() {
                                window.location = "verify.html";
                            }, 1500);
                        }
                    }
                },
                error: function (err) {
                    $('.rotator').removeClass('spinner');

                    $("#errMsg").text(err);
                    $("#btnSignUp").attr("disabled", false);
                }
            });
            
        
        });
    
   
});
}
function signupForm1() {

    var thisAlert = $('#suemail1').parent();
    $(thisAlert).removeClass('alert-validate');
    var thisAlert = $('#suemail1').parent();
    $(thisAlert).removeClass('alert-validate1');
    var thisAlert = $('#sumobile1').parent();
    $(thisAlert).removeClass('alert-validate');
    var thisAlert = $('#supassword1').parent();
    $(thisAlert).removeClass('alert-validate');
    var thisAlert = $('#supassword1').parent();
    $(thisAlert).removeClass('alert-validate1');
    var thisAlert = $('#sucpassword1').parent();
    $(thisAlert).removeClass('alert-validate');


    let email = $('#suemail1').val().trim();
    let mobile= $('#sumobile1').val().trim();
    let password = $('#supassword1').val();
    let confirmPassword = $('#sucpassword1').val();

    
    var emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
     if(email==="")
     { 
       var thisAlert = $('#suemail1').parent();
       $(thisAlert).addClass('alert-validate');
       return;
     }
     if(emailReg.test(email)==false)
     {
        var thisAlert = $('#suemail1').parent();
        $(thisAlert).addClass('alert-validate1');
        return;
     }
     
     if (mobile === "") {
        var thisAlert = $('#sumobile1').parent();
        $(thisAlert).addClass('alert-validate');
        return;
      }
    if (mobile.length !== 10) {
        var thisAlert = $('#sumobile1').parent();
        $(thisAlert).addClass('alert-validate');
        return;
    }
    if (isNaN(mobile)) {
        var thisAlert = $('#sumobile1').parent();
        $(thisAlert).addClass('alert-validate');
        return;
    }
    if(password===""){
        var thisAlert = $('#supassword1').parent();
        $(thisAlert).addClass('alert-validate');
        return;
    }
    if(password.length<6){
        var thisAlert = $('#supassword1').parent();
        $(thisAlert).addClass('alert-validate1');
        return;
    }

     if (confirmPassword !== password) {
        var thisAlert = $('#sucpassword1').parent();
         $(thisAlert).addClass('alert-validate');
        return;
    }

    $("#btnSignUp1").attr("disabled", true);
    $('.rotator').addClass('spinner');

    grecaptcha.ready(function () {
        grecaptcha.execute('6LdPBsgUAAAAAPMm-Lao4qSFeiQXuX1hDibxnJNZ', { action: 'signup' }).then(function (tokenn) {
            $.ajax({
                url: url + "/register",
                method: "POST",
                data: {
                    email: email,
                    phoneNo: mobile,
                    password: password,
                    confPassword: confirmPassword,
                    captchaToken: tokenn
                },
                crossDomain: true,
                success: function (res) {
                    $('.rotator').removeClass('spinner');

                    if (res.status !== 200) {
                        $("#errMsg1").text(res.message);
                        $("#btnSignUp1").attr("disabled", false);
                    }
                    else if (res.status === 200) {
                        if (res.isVerified === false) {
                            localStorage.setItem("token", res.token);
                            $("#errMsg1").css({ color: "green" });
                            $("#errMsg1").text("Successfully Registered");
                            setTimeout(function() {
                                window.location = "verify.html";
                            }, 1500);
                        }
                    }
                },
                error: function (err) {
                    $('.rotator').removeClass('spinner');

                    $("#errMsg1").text(err);
                    $("#btnSignUp1").attr("disabled", false);
                }
            });
            
        
        });
    
   
});
}