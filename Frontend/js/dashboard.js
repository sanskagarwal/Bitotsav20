$("#loadshow1").hide();
$("#loadshow2").hide();
$("#teamMembersDetail").hide();
$("#teamSize").change(function () {
    var x = $(this).children("option:selected").val();
    if (x == 7) {
        $("#bitId6").attr("disabled", false);
        $("#email6").attr("disabled", false);
        $("#bitId7").attr("disabled", true);
        $("#email7").attr("disabled", true);
    }
    if (x == 8) {
        $("#bitId6").attr("disabled", false);
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
    window.location.href = "./signupin.html";

})

$(window).on("load resize ", function () {
    var scrollWidth = $('.tbl-content').width() - $('.tbl-content table').width();
    $('.tbl-header').css({
        'padding-right': scrollWidth
    });
}).resize();


const url = "https://bitotsav.in/api";
let dhwaniCounter = 0, dansationCounter = 0, swaangCounter = 0, rhetoricCounter = 0, taabirCounter = 0, adaaCounter = 0, digitalesCounter = 0, heraldCounter = 0, merakiCounter = 0, euphoriaCounter = 0;
var userEvents = [];
function getAllEvents() {
    $.ajax({
        url: url + "/events/allEvents",
        method: "GET",
        headers: {
            "x-access-token": localStorage.getItem("token")
        },
        cors: true,
        success: function (res) {
            if (res.status === 200) {

                var allevents = res.events;
                console.log(allevents);
                console.log(typeof (allevents instanceof Array));
                let notRegisteredEvents = res.events;
                for (let i = 0; i < allevents.length; i++) {
                    let eventRegistered = false;
                    for (let j = 0; j < userEvents.length; j++) {
                        if (userEvents[j].eventId === allevents[i].id) {
                            eventRegistered = true;
                        }
                    }
                    if (eventRegistered === true) {
                        notRegisteredEvents.splice(i);
                    }
                }
                console.log(notRegisteredEvents)
                for (let i = 0; i < notRegisteredEvents.length; i++) {
                    let category = notRegisteredEvents[i].eventCategory;
                    category = category.toUpperCase();
                    if (category === "DHWANI") {
                        dhwaniCounter = dhwaniCounter + 1;
                        dropdownEvents(category, notRegisteredEvents[i].name, dhwaniCounter);
                    }
                    if (category === "DANSATION") {
                        dansationCounter = dansationCounter + 1;
                        dropdownEvents(category, notRegisteredEvents[i].name, dansationCounter);
                    }
                    if (category === "SWAANG") {
                        swaangCounter = swaangCounter + 1;
                        dropdownEvents(category, notRegisteredEvents[i].name, swaangCounter);
                    }
                    if (category === "RHETORIC") {
                        rhetoricCounter = rhetoricCounter + 1;
                        dropdownEvents(category, notRegisteredEvents[i].name, rhetoricCounter);
                    }
                    if (category === "TAABIR") {
                        taabirCounter = taabirCounter + 1;
                        dropdownEvents(category, notRegisteredEvents[i].name, taabirCounter);
                    }
                    if (category === "ADAA") {
                        adaaCounter = adaaCounter + 1;
                        dropdownEvents(category, notRegisteredEvents[i].name, adaaCounter);
                    }
                    if (category === "DIGITALES") {
                        digitalesCounter = digitalesCounter + 1;
                        dropdownEvents(category, notRegisteredEvents[i].name, digitalesCounter);
                    }
                    if (category === "HERALD") {
                        heraldCounter = heraldCounter + 1;
                        dropdownEvents(category, notRegisteredEvents[i].name, heraldCounter);
                    }
                    if (category === "MERAKI") {
                        merakiCounter = merakiCounter + 1;
                        dropdownEvents(category, notRegisteredEvents[i].name, merakiCounter);
                    }
                    if (category === "EUPHORIA") {
                        euphoriaCounter = euphoriaCounter + 1;
                        dropdownEvents(category, notRegisteredEvents[i].name, euphoriaCounter);
                    }
                }
            }
        },
        error: function (err) {
            console.log(err);
        }
    });
}

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
            $("#userBitId").val(`BIT-${res.user._doc.bitotsavId}`);
            $("#userClgId").val(res.user._doc.clgId);
            $("#userClgName").val(res.user._doc.clgName);
            $("#userClgCity").val(res.user._doc.clgCity);
            $("#userClgState").val(res.user._doc.clgState);
            $("#bitId0").val(res.user._doc.bitotsavId);
            $("#email0").val(res.user._doc.email);
            if (res.isInTeam === true) {
                $("#tableAndForm").remove();
                userEvents = res.user.teamEventsRegistered;
                $("#header-name").text(`Team Name : ${res.team.teamName}`);
                $("#header-size").text(`Team Size : ${res.team.teamSize}`);
                $("#header-id").text(`Team Id : ${res.team.teamId}`);
                for (i = 0; i < res.team.teamMembers.length; i++) {
                    $("#teamMembersRow").append(`<tr>
                        <td>${res.team.teamMembers[i].name}</td>
                        <td>${res.team.teamMembers[i].bitotsavId}</td>
                        <td>${res.team.teamMembers[i].email}</td>
                        </tr>`)
                }
                $("#teamMembersDetail").show();
            }
            else {
                userEvents = res.user.soloEventsRegistered;
            }
            if (!userEvents) {
                userEvents = [];
                $("#events-table").append("<tr id='no-events'><td>You are currently not registered in any event.</td></tr>")
            } else {
                $("#no-events").remove();
            }
            if(res.user.gender === 0){
                $("#gender-icon-insert").prepend("<i id='gender-icon' class='fas fa-female'>")
            } else {
                $("#gender-icon-insert").prepend("<i id='gender-icon' class='fas fa-male'>")
            }

            getAllEvents();
            for (let i = 0; i < userEvents.length; i++) {
                let isEventLead = userEvents[i].eventLeaderBitotsavId === res.user.bitotsavId;
                eventlist(userEvents[i].eventId, userEvents[i].eventName, userEvents[i].eventLeaderBitotsavId, isEventLead);
            }

        }
    }
});

function dropdownEvents(ctg, newEvent, counter) {
    ctg = ctg.toLowerCase();
    let appendEvent = '<a class="dropdown-item " href="eventsdetails.html?q=' + ctg + '#events' + counter + 'Modal">' + newEvent + '</a>';
    console.log(appendEvent);
    ctg = ctg.toUpperCase();
    $("#" + ctg).append(appendEvent);
}

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
