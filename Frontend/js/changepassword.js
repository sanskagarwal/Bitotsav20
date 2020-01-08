let url4 = "https://bitotsav.in/api/auth";



function changePassword() {

    var thisAlert = $('#cemail').parent();
    $(thisAlert).removeClass('alert-validate');
    var thisAlert = $('#cemail').parent();
    $(thisAlert).removeClass('alert-validate1');
    var thisAlert = $('#ceotp').parent();
    $(thisAlert).removeClass('alert-validate');
    var thisAlert = $('#csupassword').parent();
    $(thisAlert).removeClass('alert-validate');
    var thisAlert = $('#csupassword').parent();
    $(thisAlert).removeClass('alert-validate1');
    var thisAlert = $('#csucpassword').parent();
    $(thisAlert).removeClass('alert-validate');


    let email = $('#cemail').val().trim();
    let emailOTP= $('#ceotp').val().trim();
    let password = $('#csupassword').val();
    let confPassword = $('#csucpassword').val();

    
    var emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
     if(email==="")
     { 
       var thisAlert = $('#cemail').parent();
       $(thisAlert).addClass('alert-validate');
       return;
     }
     if(emailReg.test(email)==false)
     {
        var thisAlert = $('#cemail').parent();
        $(thisAlert).addClass('alert-validate1');
        return;
     }
     if (emailOTP === "") {
        var thisAlert = $('#ceotp').parent();
        $(thisAlert).addClass('alert-validate');
        return;
    }
    if (emailOTP.length != 6) {
        var thisAlert = $('#ceotp').parent();
        $(thisAlert).addClass('alert-validate');
        return;
    }
    
    if(password===""){
        var thisAlert = $('#csupassword').parent();
        $(thisAlert).addClass('alert-validate');
        return;
    }
    if(password.length<6){
        var thisAlert = $('#csupassword').parent();
        $(thisAlert).addClass('alert-validate1');
        return;
    }

     if (confPassword !== password) {
        var thisAlert = $('#csucpassword').parent();
         $(thisAlert).addClass('alert-validate');
        return;
    }

    $("#btnChangePassword").attr("disabled", true);
    grecaptcha.ready(function () {
        grecaptcha.execute('6LdPBsgUAAAAAPMm-Lao4qSFeiQXuX1hDibxnJNZ', { action: 'changepassword' }).then(function (tokenn) {
            $.ajax({
                url: url4 + "/changePassword",
                method: "POST",
                data: {
                    email: email,
                    password: password,
                    confPassword: confPassword,
                    emailOTP: emailOTP,
                    captchaToken: tokenn
                },
                crossDomain: true,
                success: function (res) {
                    if (res.status !== 200) {
                        $("#errMssg").text(res.message);
                        $("#btnChangePassword").attr("disabled", false);
                    }
                    else if (res.status === 200) {
                        $("#errMssg").css({ "color": "green" });
                        $("#errMssg").text("*Password changed Successfully");
                        localStorage.setItem("token", res.token);
        
                        setTimeout(() => {
                            window.location = "changePassword.html";
                        }, 1500);
                    }
                },
                error: function (err) {
                    $("#errMssg").text(res.message);
                    $("#btnChangePassword").attr("disabled", false);
                }
            });
            
        
        });
    
   
});
}