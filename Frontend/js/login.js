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