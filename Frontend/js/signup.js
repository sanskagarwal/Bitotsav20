
$("#sPasswordMatch").hide();
$("#lsuCaptcha").hide();

function signupForm() {
    let email = $('#suemail').val().trim();
    let password = $('#supassword').val();
    let confirmPassword = $('#sucpassword').val();
    let captchaToken = grecaptcha.getResponse();

    $("#sPasswordMatch").hide();
    $("#lsuCaptcha").hide();


    if (confirmPassword !== password) {
        $("#sPasswordMatch").show();
        return;
    }

    if (captchaToken === "") {
        $("#lsuCaptcha").show();
        return;
    }
}