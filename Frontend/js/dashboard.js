$("#loadshow1").hide();
$("#loadshow2").hide();
$("#teamSize").change(function () {
    var x = $(this).children("option:selected").val();
    if (x == 7) {
        $("#bitId6").attr("disabled", false);
        $("#email6").attr("disabled", false);
        $("#bitId7").attr("disabled", true);
        $("#email7").attr("disabled", true);
    }
    if (x == 8) {
        $("bitId6").attr("disabled", false);
        $("#email6").attr("disabled", false);
        $("#bitId7").attr("disabled", false);
        $("#email7").attr("disabled", false);
    }
    if (x == 6) {
        $("#bitId6").attr("disabled", true);
        $("#email6").attr("disabled", true);
        $("#bitId7").attr("disabled", true);
        $("#email7").attr("disabled", true);
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


const url = "https://bitotsav.in/api";
/*$.ajax({
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
});*/

var allevents;
var userEvents;

$.ajax({
    url: url + "/events/allEvents",
    method: "GET",
    headers: {
        "x-access-token": localStorage.getItem("token")
    },
    cors: true,
    success: function (res) {
        if (res.status === 200) {
            allevents = res.events;
        }
    },
    error: function (err) {
        console.log(err);
    }
});

$.ajax({
    url: url + "/dash/getProfile",
    method: "GET",
    headers: {
        "x-access-token": localStorage.getItem("token")
    },
    cors: true,
    success: function (res) {
        if (res.status === 200) {
            console.log(res);
            $("#userName").val(res.user._doc.name);
            $("#userEmail").val(res.user._doc.email);
            $("#userPhone").val(res.user._doc.phoneNo);
            $("#userBitId").val(res.user._doc.bitotsavId);
            $("#userClgId").val(res.user._doc.clgId);
            $("#userClgName").val(res.user._doc.clgName);
            $("#userClgCity").val(res.user._doc.clgCity);
            $("#userClgState").val(res.user._doc.clgState);
            $("#bitId0").val(res.user._doc.bitotsavId);
            $("#email0").val(res.user._doc.email);
            if (res.isInTeam == true) {
                $("#tableAndForm").remove();
                $("#team").append(`<div >
                <h2>Team Details</h2>
                <br/>
                <ol>
                <li style="margin-top: 5px;">Team Name: </li>
                <li style="margin-top: 5px;">Team Size: </li>
                <li style="margin-top: 5px;">Team Id: </li>
               </ol>
                <table class="table">
                  <thead>
                    <tr>
                      <th>Member Name</th>
                      <th>Bitotsav Id</th>
                      <th>Email</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Default</td>
                      <td>Defaultson</td>
                      <td>def@somemail.com</td>
                    </tr>
                    <tr>
                      <td>Success</td>
                      <td>Doe</td>
                      <td>john@example.com</td>
                    </tr>
                    <tr>
                      <td>Danger</td>
                      <td>Moe</td>
                      <td>mary@example.com</td>
                    </tr>
                    <tr>
                      <td>Info</td>
                      <td>Dooley</td>
                      <td>july@example.com</td>
                    </tr>
                    <tr>
                      <td>Warning</td>
                      <td>Refs</td>
                      <td>bo@example.com</td>
                    </tr>
                    <tr>
                      <td>Active</td>
                      <td>Activeson</td>
                      <td>act@example.com</td>
                    </tr>
                  </tbody>
                </table>
              </div>`)
            }
            if (res.isInTeam === true) {
                userEvents = res.user.teamEventsRegistered;
            }
            else {
                userEvents = res.user.soloEventsRegistered;
            }
            for (i = 0; i < userEvents.length; i++) {
                var isEventLead = userEvents[i].eventLeaderBitotsavId === res.user.bitotsavId;
                eventlist(userEvents[i].eventId, userEvents[i].eventName, userEvents[i].eventLeaderBitotsavId, isEventLead);
            }
        }
    }
});


function deregisterEvent(eid) {
    $.ajax({
        url: url + "/dash/deregister",
        method: "POST",
        data: { eventId: eid },
        headers: {
            "x-access-token": localStorage.getItem("token")
        },
        crossDomain: true,
        success: function (res) {
            alert(res.message);
            $('#event' + eid).remove();
        },
        error: function (err) {
            console.log(err);
        }
    });
}

function eventlist(i, n, t, l) {
    var eventId = i;
    var eventName = n;
    var teamLeaderId = t;
    var deregister_button = "<button onclick = 'deregisterEvent(" + eventId + ")'> Deregister Event </button>";
    if (l === false) {
        var newevent = "<tr id='event" + eventId + "'> <td>" + eventId + "</td><td >" + eventName + "</td><td >" + teamLeaderId + "</td></tr>";
    }
    else {
        var newevent = "<tr> <td>" + eventId + "</td><td >" + eventName + "</td><td >" + teamLeaderId + "</td><td>" + deregister_button + "</td></tr>";
    }
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
        url: url + "/dash/updatePassword",
        method: "POST",
        headers: {
            "x-access-token": localStorage.getItem("token")
        },
        cors: true,
        data: {
            password: newPassword,
            confPassword: confirmPassword
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


function registerTeam() {

    var teamName = $("#teamName").val();
    var teamSize = $("#teamSize").val();

    var teamSize1 = Number($("#teamSize").val());
    for (i = 1; i < teamSize1; i++) {
        if ($(`#bitId${i}`).val() == "") {
            $(`#bitId${i}`).show();
            return;
        }
        else if ($(`#email${i}`).val() == "") {
            $(`#email${i}`).show();
            return;
        }
    }
    $("#loadshow2").show();
    $("#teamRegister").attr("disabled", true);
    const membersData = [];
    for (i = 0; i < teamSize1; i++) {
        obj = {
            bitotsavId: $(`#bitId${i}`).val(),
            email: $(`#email${i}`).val()
        }
        membersData.push(obj);
    }

    console.log(membersData);
    console.log(teamName);
    console.log(teamSize);


    $.ajax({
        url: url + "/dash/teamRegister",
        method: "POST",
        headers: {
            "x-access-token": localStorage.getItem("token")
        },
        cors: true,
        data: {
            teamName: teamName,
            teamSize: teamSize,
            membersData: membersData
        },
        success: function (res) {
            if (res.status == 200) {
                $("#reg-message").text(res.message);
                $("#loadshow2").hide();
                $("#teamRegister").attr("disabled", false);
            }
            else {
                $("#reg-message").text(res.message);
                $("#loadshow2").hide();
                $("#teamRegister").attr("disabled", false);
                // setTimeout(function () {
                //     window.location.reload(true);
                // }, 1600);
            }
        },
        error: function (err) {
            console.log(err);
        }
    });
}
