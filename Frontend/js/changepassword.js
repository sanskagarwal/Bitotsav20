
$("#sPasswordMatch").hide();
$("#lsCaptcha").hide();

function resetPassword() {
        let password = $('#supassword').val();
    let confirmPassword = $('#sucpassword').val();
    let captchaToken = grecaptcha.getResponse();

    $("#sPasswordMatch").hide();
    $("#lsCaptcha").hide();


    if (confirmPassword !== password) {
        $("#sPasswordMatch").show();
        return;
    }

    if (captchaToken === "") {
        $("#lsCaptcha").show();
        return;
    }
}