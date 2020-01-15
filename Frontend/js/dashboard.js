$("#loadshow1").hide();
$("#teamSize").change(function () {
    var x = $(this).children("option:selected").val();
    if (x == 7) {
        $("#bitId7").attr("disabled", false);
        $("#email7").attr("disabled", false);
        $("#bitId8").attr("disabled", true);
        $("#email8").attr("disabled", true);
    }
    if (x == 8) {
        $("bitId7").attr("disabled", false);
        $("#email7").attr("disabled", false);
        $("#bitId8").attr("disabled", false);
        $("#email8").attr("disabled", false);
    }
    if (x == 6) {
        $("#bitId7").attr("disabled", true);
        $("#email7").attr("disabled", true);
        $("#bitId8").attr("disabled", true);
        $("#email8").attr("disabled", true);
    }
});

$("#logoutBtn").click(function () {
    localStorage.setItem("token", "");
    window.location.href = "./index.html";

})

$(window).on("load resize ", function () {
    var scrollWidth = $('.tbl-content').width() - $('.tbl-content table').width();
    $('.tbl-header').css({
        'padding-right': scrollWidth
    });
}).resize();


const url = "https://bitotsav.in/api/dash";
$.ajax({
    url: url + "/userProfile",
    method: "GET",
    headers: {
        "x-access-token": localStorage.getItem("token")
    },
    cors: true,
    success: (res) => {
        if (res.status === 200) {
            $("#userName").val(res.user.name);
            $("#userEmail").val(res.user.email);
            $("#userPhone").val(res.user.phoneNo);
            $("#userBitId").val("BIT-" + res.user.bitotsovId);
            $("#userClgId").val(res.user.clgId);
            $("#userClgName").val(res.user.clgName);
            $("#userClgCity").val(res.user.clgCity);
            $("#userClgState").val(res.user.clgState);
        }
    },
    error: function (err) {
        console.log(err);
    }
});

var allevents;
var userEvents;

$.ajax({
    url: url + "/events/allEvents",
    method: "GET",
    headers: {
        "x-access-token": localStorage.getItem("token")
    },
    cors: true,
    success: (res) => {
        if (res.status === 200){
            allevents=res.events;
        }
    },
    error: (err) => {
        console.log(err);
    }
});

$.ajax({
    url: url + "/dash/getProfile",
    method: "GET",
    headers: {
        "x-access-token": localStorage.getItem("token")
    },
    cors:true,
    success: (res) => {
        if(res.isInTeam === true){
            userEvents = res.user.teamEventsRegistered;
        }
        else{
            userEvents = res.user.soloEventsRegistered;
        }
        for(i=0; i<userEvents.length; i++){
            eventlist(userEvents[i].eventId,userEvents[i].eventName,userEvents[i].eventLeaderBitotsavId);
        }
    }
})



function eventlist(i,n,t) {
    var eventId = i;
    var eventName = n;
    var teamLeaderId = t;
    var newevent = "<tr> <td>" + eventId + "</td><td >" + eventName + "</td><td >" + teamLeaderId + "</td></tr>";
    $("#events-table").append(newevent);
}

function changePassword() {
    $("#password-message").text("");
    var newPassword = $("#newPassword").val();
    var confirmPassword = $("#confirmPassword").val();
    if (newPassword === "") {
        $("#newPassword").show();
        return;
    }

    if (confirmPassword === "") {
        $("#confirmPassword").show();
        return;
    }

    if (newPassword !== confirmPassword) {
        $("#password-message").text("Password and Confirm password dint match");
        return;
    }
    $("#loadshow1").show();
    $("#changePasswordBtn").attr("disabled", true);
    $.ajax({
        url: url + "/updatePassword",
        method: "POST",
        headers: {
            "x-access-token": localStorage.getItem("token")
        },
        cors: true,
        data: {
            newPassword: newPassword,
            confirmPassword: confirmPassword
        },
        success: function (res) {
            if (res.status == 200) {
                $("#password-message").text(res.message);
                $("#registerbtn").attr("disabled", false);
                $("#loadshow1").hide();
            }
            else {
                $("#password-message").text(res.message);
                $("#changePasswordBtn").attr("disabled", false);
                $("#loadshow1").hide();
                // setTimeout(function () {
                //     window.location.reload(true);
                // }, 1600);
            }
        },
        error: function (err) {
            console.log(err);
            $("#changePasswordBtn").attr("disabled", false);
            $("#loadshow1").hide();
        }
    });

}

$("#teamRegister").click(function () {

    var teamName = $("#teamName").val();
    var teamSize = $("#teamSize").val();

    var bitId1 = $("#bitId1").val();
    var email1 = $("#email1").val();

    var bitId2 = $("#bitId2").val();
    var email2 = $("#email2").val();

    var bitId3 = $("#bitId3").val();
    var email3 = $("#email3").val();

    var bitId4 = $("#bitId4").val();
    var email4 = $("#email4").val();

    var bitId5 = $("#bitId5").val();
    var email5 = $("#email5").val();

    var bitId6 = $("#bitId6").val();
    var email6 = $("#email6").val();

    var bitId7 = $("#bitId7").val();
    var email7 = $("#email7").val();

    var bitId8 = $("#bitId").val();
    var email8 = $("#email8").val();

    if (teamName == "") {
        $("#teamName").show();
        return;
    }

    if (bitId2 == "") {
        $("#bitId2").show();
        return;
    }

    if (email2 == "") {
        $("#email2").show();
        return;
    }

    if (bitId3 == "") {
        $("#bitId3").show();
        return;
    }

    if (email3 == "") {
        $("#email3").show();
        return;
    }

    if (bitId4 == "") {
        $("#bitId4").show();
        return;
    }

    if (email4 == "") {
        $("#email4").show();
        return;
    }

    if (bitId5 == "") {
        $("#bitId5").show();
        return;
    }

    if (email5 == "") {
        $("#email5").show();
        return;
    }

    if (bitId6 == "") {
        $("#bitId6").show();
        return;
    }

    if (email6 == "") {
        $("#email6").show();
        return;
    }

    if (bitId7 == "") {
        $("#bitId7").show();
        return;
    }

    if (email7 == "") {
        $("#email7").show();
        return;
    }

    if (bitId8 == "") {
        $("#bitId8").show();
        return;
    }

    if (email8 == "") {
        $("#email8").show();
        return;
    }

    $.ajax({
        url: url + "/teamRegister",
        method: "POST",
        headers: {
            "x-access-token": localStorage.getItem("token")
        },
        cors: true,
        data: {
            teamName: teamName,
            teamSize: teamSize,
            bitId1: bitId1,
            email1: email1,
            bitId2: bitId2,
            email2: email2,
            bitId3: bitId3,
            email3: email3,
            bitId4: bitId4,
            email4: email4,
            bitId5: bitId5,
            email5: email5,
            bitId6: bitId6,
            email6: email6,
            bitId7: bitId7,
            email7: email7,
            bitId8: bitId8,
            email8: email8
        },
        success: function (res) {
            if (res.status == 200) {
                $("#reg-message").text(res.message);
            }
            else {
                $("#reg-message").text(res.message);
                // setTimeout(function () {
                //     window.location.reload(true);
                // }, 1600);
            }
        },
        error: function (err) {
            console.log(err);
        }
    });

})
