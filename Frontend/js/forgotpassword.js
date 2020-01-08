let url2= "https://bitotsav.in/api/auth";
function forgotPassword() {

    var thisAlert = $('#femail').parent();
    $(thisAlert).removeClass('alert-validate');
    var thisAlert = $('#femail').parent();
    $(thisAlert).removeClass('alert-validate1');
    
  


    let email = $('#femail').val().trim();
    

    
    var emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
     if(email==="")
     { 
       var thisAlert = $('#femail').parent();
       $(thisAlert).addClass('alert-validate');
       return;
     }
     if(emailReg.test(email)==false)
     {
        var thisAlert = $('#femail').parent();
        $(thisAlert).addClass('alert-validate1');
        return;
     }
     
     
    
    $("#btnForgotPassword").attr("disabled", true);

    grecaptcha.ready(function () {
        grecaptcha.execute('6LdPBsgUAAAAAPMm-Lao4qSFeiQXuX1hDibxnJNZ', { action: 'forgotpassword' }).then(function (tokenn) {
        
            $.ajax({
                url: url + "/forgotPassword",
                method: "POST",
                data: {
                    email: email,
                    captchaToken: tokenn
                },
                crossDomain: true,
                success: function (res) {
                    if (res.status !== 200) {
                        $("#errrrMsg").text(res.message);
                        $("#btnForgotPassword").attr("disabled", false);
                    }
                    else if (res.status === 200) {
                        $("#errrrMsg").css({ "color": "green" });
                        $("#errrrMsg").text("An OTP has been sent to your registered email id");
                        localStorage.setItem("token", res.token);
        
                        setTimeout(() => {
                            window.location = "signupin.html";
                        }, 1500);
                    }
                },
                error: function (err) {
                    $("#errrrMsg").text(res.message);
                    $("#btnForgotPassword").attr("disabled", false);
                }
            });
        
        });
    
   
});
}