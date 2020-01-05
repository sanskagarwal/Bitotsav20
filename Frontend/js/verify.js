
function verifyForm() {
        var thisAlert = $('#name').parent();
        $(thisAlert).removeClass('alert-validate');
        var thisAlert = $('#eotp').parent();
        $(thisAlert).removeClass('alert-validate');
        var thisAlert = $('#mobile').parent();
        $(thisAlert).removeClass('alert-validate');
        var thisAlert = $('#gender').parent();
        $(thisAlert).removeClass('alert-validate');
        var thisAlert = $('#clgname').parent();
        $(thisAlert).removeClass('alert-validate');
        var thisAlert = $('#clgroll').parent();
        $(thisAlert).removeClass('alert-validate');
        var thisAlert = $('#clgcity').parent();
        $(thisAlert).removeClass('alert-validate');

    let email = $('#email').val().trim();
    let otp = $('#eotp').val().trim();
    let name = $('#name').val().trim();
    let mobile = $('#mobile').val().trim();
    let gender = $('#gender').val().trim();
    let collegename = $('#clgname').val().trim();
    let collegeroll = $('#clgroll').val().trim();
    let collegecity = $('#clgcity').val().trim();


    if (name === "") {
        var thisAlert = $('#name').parent();
        $(thisAlert).addClass('alert-validate');
        return;
    }

    if (otp === "") {
        var thisAlert = $('#eotp').parent();
        $(thisAlert).addClass('alert-validate');
        return;
    }
    if (otp.length != 6) {
        var thisAlert = $('#eotp').parent();
        $(thisAlert).addClass('alert-validate');
        return;
    }

    if (mobile === "") {
        var thisAlert = $('#mobile').parent();
        $(thisAlert).addClass('alert-validate');
        return;
    }
    if (mobile.length !== 10) {
        var thisAlert = $('#mobile').parent();
        $(thisAlert).addClass('alert-validate');
        return;
    }
    if (isNaN(mobile)) {
        var thisAlert = $('#mobile').parent();
        $(thisAlert).addClass('alert-validate');
        return;
    }


    if (gender === "") {
        var thisAlert = $('#gender').parent();
        $(thisAlert).addClass('alert-validate');
        return;
    }

    if (collegename === "") {
        var thisAlert = $('#clgname').parent();
        $(thisAlert).addClass('alert-validate');
        return;
    }
    if (collegecity === "") {
        var thisAlert = $('#clgcity').parent();
        $(thisAlert).addClass('alert-validate');
        return;
    }
    

    if (collegeroll === "") {
        var thisAlert = $('#clgroll').parent();
        $(thisAlert).addClass('alert-validate');
        return;
    }}