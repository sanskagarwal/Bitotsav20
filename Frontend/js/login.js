let url1= "https://bitotsav.in/api/auth";


$.ajax({
    url: url + "/getUserState",
    method: "GET",
    headers: {
        'x-access-token': localStorage.getItem("token")
    },
    crossDomain: true,
    success: function (res) {
        if (res.status === 200) {
            window.location = "profile.html";
        }
    },
    error: function (err) {
    }
});
$('#SSS').hide();
$('#SS').show();
function SForm(){
    $('#SS').hide();
    $('#SSS').show();
}
function loginForm() {

    var thisAlert = $('#semail').parent();
    $(thisAlert).removeClass('alert-validate');
    var thisAlert = $('#semail').parent();
    $(thisAlert).removeClass('alert-validate1');
    var thisAlert = $('#spassword').parent();
    $(thisAlert).removeClass('alert-validate');
    var thisAlert = $('#spassword').parent();
    $(thisAlert).removeClass('alert-validate1');
  


    let email = $('#semail').val().trim();
    let password = $('#spassword').val();
    

    
    var emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
     if(email==="")
     { 
       var thisAlert = $('#semail').parent();
       $(thisAlert).addClass('alert-validate');
       return;
     }
     if(emailReg.test(email)==false)
     {
        var thisAlert = $('#semail').parent();
        $(thisAlert).addClass('alert-validate1');
        return;
     }
     
     
    if(password===""){
        var thisAlert = $('#spassword').parent();
        $(thisAlert).addClass('alert-validate');
        return;
    }
    if(password.length<6){
        var thisAlert = $('#spassword').parent();
        $(thisAlert).addClass('alert-validate1');
        return;
    }
    $("#btnSignIn").attr("disabled", true);
    $('.rotator').addClass('spinner');

    grecaptcha.ready(function () {
        grecaptcha.execute('6LdPBsgUAAAAAPMm-Lao4qSFeiQXuX1hDibxnJNZ', { action: 'login' }).then(function (tokenn) {
        
            $.ajax({
                url: url1 + "/login",
                method: "POST",
                data: {
                    email: email,
                    password: password,
                    captchaToken: tokenn
                },
                crossDomain: true,
                success: function (res) {
                    $('.rotator').removeClass('spinner');

                    if (res.status !== 200) {
                        $("#errrMsg").text(res.message);
                        $("#btnSignIn").attr("disabled", false);
                    }
                    else if (res.status === 200) {
                        if (res.isVerfied === false) {
                            localStorage.setItem("token", res.token);
                            window.location = "verify.html";
                        }
                        else {
                            localStorage.setItem("token", res.token);
                            window.location = "profile.html";
                        }
                    }
                },
                error: function (err) {
                    $("#errrMsg").text(err);
                    $('.rotator').removeClass('spinner');

                    $("#btnSignIn").attr("disabled", false);
                    
                }
            });
        
        });
    
   
});
}
function loginForm1() {

    var thisAlert = $('#semail1').parent();
    $(thisAlert).removeClass('alert-validate');
    var thisAlert = $('#semail1').parent();
    $(thisAlert).removeClass('alert-validate1');
    var thisAlert = $('#spassword1').parent();
    $(thisAlert).removeClass('alert-validate');
    var thisAlert = $('#spassword1').parent();
    $(thisAlert).removeClass('alert-validate1');
  


    let email = $('#semail1').val().trim();
    let password = $('#spassword1').val();
    

    
    var emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
     if(email==="")
     { 
       var thisAlert = $('#semail1').parent();
       $(thisAlert).addClass('alert-validate');
       return;
     }
     if(emailReg.test(email)==false)
     {
        var thisAlert = $('#semail1').parent();
        $(thisAlert).addClass('alert-validate1');
        return;
     }
     
     
    if(password===""){
        var thisAlert = $('#spassword1').parent();
        $(thisAlert).addClass('alert-validate');
        return;
    }
    if(password.length<6){
        var thisAlert = $('#spassword1').parent();
        $(thisAlert).addClass('alert-validate1');
        return;
    }
    $("#btnSignIn1").attr("disabled", true);
    $('.rotator').addClass('spinner');

    grecaptcha.ready(function () {
        grecaptcha.execute('6LdPBsgUAAAAAPMm-Lao4qSFeiQXuX1hDibxnJNZ', { action: 'login' }).then(function (tokenn) {
        
            $.ajax({
                url: url1 + "/login",
                method: "POST",
                data: {
                    email: email,
                    password: password,
                    captchaToken: tokenn
                },
                crossDomain: true,
                success: function (res) {
                    $('.rotator').removeClass('spinner');

                    if (res.status !== 200) {
                        $("#errrMsg1").text(res.message);
                        $("#btnSignIn1").attr("disabled", false);
                    }
                    else if (res.status === 200) {
                        if (res.isVerfied === false) {
                            localStorage.setItem("token", res.token);
                            window.location = "verify.html";
                        }
                        else {
                            localStorage.setItem("token", res.token);
                            window.location = "profile.html";
                        }
                    }
                },
                error: function (err) {
                    $("#errrMsg1").text(err);
                    $('.rotator').removeClass('spinner');

                    $("#btnSignIn1").attr("disabled", false);
                    
                }
            });
        
        });
    
   
});
}