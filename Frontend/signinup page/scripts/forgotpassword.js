let url = "https://pantheonbit.com/api/auth"; //please change

$("#lsCaptcha").hide();

function forgotPassword() {
    let email = $('#forgotemail').val().trim();
    let captchaToken = grecaptcha.getResponse();

    $("#lsCaptcha").hide();
    $("#forgotemail").css({ "border": "" });


    if (captchaToken === "") {
        $("#lsCaptcha").show();
        return;
    }
}