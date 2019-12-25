let url1 = "https://bitotsav.in/api";
$("#loadshow1").hide();
$("#loadshow2").hide();
//form ajax
$("#sapRegister").submit(function (e) {
    e.preventDefault();

    $("#sendmessage").css({ "display": "none" });
    $("#errormessage").css({ "display": "none" });

    var name = $("#name").val();
    var college = $("#college").val();
    var phone = $("#phone").val();
    var email = $("#email").val();

    var q1 = $("#q1").val();
    var q2 = $("#q2").val();
    var q3 = $("#q3").val();
    var q4 = $("#q4").val();
    var q5 = $("#q5").val();

    if (name === "") {
        $("#name").show();
        return;
    }

    if (college === "") {
        $("#college").show();
        return;
    }


    if (email === "") {
        $("#email").show();
        return;
    }


    if (phone === "") {
        $("#phone").show();
        return;
    }

    // if (phone.length != 10) {
    // 	$("#errormessage).text("enter 10 digit number");
    // 	return
    // }
    $("#registerbtn").attr("disabled", true);
    $("#loadshow1").show();

    grecaptcha.ready(function () {
        grecaptcha.execute('6LdPBsgUAAAAAPMm-Lao4qSFeiQXuX1hDibxnJNZ', { action: 'sapRegister' }).then(function (token) {
            $.ajax({
                url: url1 + "/sap/register",
                method: "POST",
                data: {
                    name: name,
                    email: email,
                    phone: phone,
                    college: college,
                    ans1: q1,
                    ans2: q2,
                    ans3: q3,
                    ans4: q4,
                    ans5: q5,
                    captchaToken: token
                },
                crossDomain: true,
                success: function (res) {
                    console.log(res);

                    if (res.status !== 200) {
                        $("#errormessage").text("*" + res.message);
                        $("#errormessage").css({ "display": "block" });
                        $("#registerbtn").attr("disabled", false);
                        $("#loadshow1").hide();
                        return;
                    }
                    $("#sendmessage").text("*" + res.message);
                    $("#sendmessage").css({ "display": "block" });
                    $("#loadshow1").hide();
                    $("#verifyEmail").val(email);
                    $('#verifyModal').modal('show');
                },
                error: function (err) {
                    $("#registerbtn").attr("disabled", false);
                    $("#loadshow1").hide();
                    console.log(err);
                }
            });
        });
    });
});

$("#sapVerify").submit(function (e) {
    e.preventDefault();

    var email = $("#verifyEmail").val();
    var otp = $("#otp").val();
    $("#verifybtn").attr("disabled", true);
    $("#loadshow2").show();
    grecaptcha.ready(function () {
        grecaptcha.execute('6LdPBsgUAAAAAPMm-Lao4qSFeiQXuX1hDibxnJNZ', { action: 'sapRegister' }).then(function (token) {
            $.ajax({
                url: url1 + "/sap/verify",
                method: "POST",
                data: {
                    email: email,
                    otp: otp,
                    captchaToken: token
                },
                crossDomain: true,
                success: function (res) {
                    console.log(res);
                    if (res.status !== 200) {
                        $("#verifyMessage").text("*" + res.message);
                        $("#verifyMessage").css({ "color": "red", "display": "block" });
                        $("#verifybtn").attr("disabled", false);
                        $("#loadshow2").hide();
                        return;
                    }
                    $("#loadshow2").hide();
                    $("#verifyMessage").text("*" + res.message);
                    $("#verifyMessage").css({ "color": "green", "display": "block" });
                },
                error: function (err) {
                    $("#verifybtn").attr("disabled", false);
                    $("#loadshow2").hide();
                    console.log(err);
                }
            });
        });
    });
});