


$("#lsCaptcha").hide();
function loginForm() {
    let email = $('#semail').val().trim();
    let password = $('#spassword').val();
    let captchaToken = grecaptcha.getResponse();
    $("#lsCaptcha").hide();
    $("#semail").css({ "border": "" });
    $("#spassword").css({ "border": "" });

    if (captchaToken === "") {
        $("#lsCaptcha").show();
        return;
    }

}