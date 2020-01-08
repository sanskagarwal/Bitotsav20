let url = "https://bitotsav.in/api/auth";

$.ajax({
    url: url + "/getUserState",
    method: "GET",
    headers: {
        'x-access-token': localStorage.getItem("token")
    },
    crossDomain: true,
    success: function (res) {
        if (res.status !== 200 && !res.email) {
            window.location = "login.html";
        }
        else if (res.status === 200) {
            window.location = "profile.html";
        }
        else {
            $("#email").val(res.email);
            $("#mobile").val(res.phoneNo);
        }
    },
    error: function (err) {
    }
});


function verifyForm() {
        var thisAlert = $('#name').parent();
        $(thisAlert).removeClass('alert-validate');
        var thisAlert = $('#eotp').parent();
        $(thisAlert).removeClass('alert-validate');
        
        var thisAlert = $('#motp').parent();
        $(thisAlert).removeClass('alert-validate');
        var thisAlert = $('#gender').parent();
        $(thisAlert).removeClass('alert-validate');
        var thisAlert = $('#clgname').parent();
        $(thisAlert).removeClass('alert-validate');
        var thisAlert = $('#clgroll').parent();
        $(thisAlert).removeClass('alert-validate');
        var thisAlert = $('#clgcity').parent();
        $(thisAlert).removeClass('alert-validate');
        var thisAlert = $('#clgstate').parent();
        $(thisAlert).removeClass('alert-validate');

    let email = $('#email').val().trim();
    let emailOTP = $('#eotp').val().trim();
    let mobileOTP=$('#motp').val().trim();
    let name = $('#name').val().trim();
    let mobile = $('#mobile').val().trim();
    let gender = $('#gender').val().trim();
    let clgName = $('#clgname').val().trim();
    let clgId = $('#clgroll').val().trim();
    let clgCity= $('#clgcity').val().trim();
    let clgState = $('#clgstate').val().trim();


    if (name === "") {
        var thisAlert = $('#name').parent();
        $(thisAlert).addClass('alert-validate');
        return;
    }

    if (emailOTP === "") {
        var thisAlert = $('#eotp').parent();
        $(thisAlert).addClass('alert-validate');
        return;
    }
    if (emailOTP.length != 6) {
        var thisAlert = $('#eotp').parent();
        $(thisAlert).addClass('alert-validate');
        return;
    }

    
    if (mobileOTP === "") {
        var thisAlert = $('#motp').parent();
        $(thisAlert).addClass('alert-validate');
        return;
    }
    if (mobileOTP.length != 6) {
        var thisAlert = $('#motp').parent();
        $(thisAlert).addClass('alert-validate');
        return;
    }


    if (gender === "") {
        var thisAlert = $('#gender').parent();
        $(thisAlert).addClass('alert-validate');
        return;
    }

    if (clgName === "") {
        var thisAlert = $('#clgname').parent();
        $(thisAlert).addClass('alert-validate');
        return;
    }
    if (clgCity === "") {
        var thisAlert = $('#clgcity').parent();
        $(thisAlert).addClass('alert-validate');
        return;
    }
    if (clgState === "") {
        var thisAlert = $('#clgstate').parent();
        $(thisAlert).addClass('alert-validate');
        return;
    }
    

    if (clgId === "") {
        var thisAlert = $('#clgroll').parent();
        $(thisAlert).addClass('alert-validate');
        return;



    }
    $("#btnSubmit").attr("disabled", true);
    grecaptcha.ready(function () {
        grecaptcha.execute('6LdPBsgUAAAAAPMm-Lao4qSFeiQXuX1hDibxnJNZ', { action: 'verify' }).then(function (tokenn) {
    $.ajax({
        url: url + "/verify",
        method: "POST",
        data: {
            email: email,
            emailOTP: emailOTP,
            mobileOTP:mobileOTP,
            name: name,
            phoneNo: mobile,
            gender: gender,
            clgName: clgName,
            clgCity: clgCity,
            clgState: clgState,
            clgId: clgId,
            captchaToken: tokenn


        },
        headers: {
            'x-access-token': localStorage.getItem("token")
        },
        crossDomain: true,
        success: function (res) {
            if (res.status !== 200) {
                $("#btnSubmit").attr("disabled", false);
                $("#errMsg").text(res.message);
            }
            else if (res.status === 200) {
                $("#errMsg").css({ "color": "green"});
                $("#errMsg").text("*Successfully verified!");
                setTimeout(function() {
                    window.location = "profile.html";
                }, 1500);
            }
        },
        error: function (err) {
            $("#btnSubmit").attr("disabled", false);
            $("#errMsg").text(err);
        }
    });
});
    });

}