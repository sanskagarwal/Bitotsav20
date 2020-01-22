var userDetails = null;
var teamDetails = null;
var isInTeam = null;
const token = localStorage.getItem("token");
fetchProfile();

function fetchProfile() {
    var url1 = "https://bitotsav.in";
    let user = null;
    $.ajax({
        url: url1 + "/api/dash/getProfile",
        method: "GET",
        headers: {
            'x-access-token': token
        },
        crossDomain: true,
        success: function (res) {
            console.log(res);
            if (res.status === 200) {
                userDetails = res.user;
                teamDetails = res.team;
                isInTeam = res.isInTeam;
            }
            getEventByCategory();
            return user;
        },
        error: function (err) {
            getEventByCategory();
            return;
        }
    });
}


function displayMembers(event, i) {
    let html = ``;
    if (userDetails === null) {
        html += `<p>You must be logged in to register in any event!</p>`;
    } else {
        if (isInTeam) {
            html += `
                <p>You team ${teamDetails.teamName.toUpperCase()} will be registered for this event.</p>
                <p>Number of allowed participants: ${event.minParticipants} - ${event.maxParticipants}.</p>
                <p>"${userDetails.name}" will be the event leader.</p>
                <p>Please choose the other participants: </p>
            `;
            const formStart = `<select class="js-example-basic-multiple" id="events${i}TeamRegisterForm" multiple="multiple">`;
            html += formStart;
            let membersHTML = ``;
            const members = teamDetails.teamMembers;
            for (let i = 0; i < members.length; i++) {
                if (members[i].email === userDetails.email) {
                    membersHTML += `<option selected="selected" value="${i.toString()}">${members[i].name} (BIT-${members[i].bitotsavId})</option>`
                } else membersHTML += `<option value="${i.toString()}">${members[i].name} (BIT-${members[i].bitotsavId})</option>`
            }
            html += membersHTML;
            const formClose = `</select>`;
            html += formClose;
            const maxParticipants = event.maxParticipants;
            // $('.js-example-basic-multiple').select2({
            // allowClear: true,
            // maximumSelectionLength: maxParticipants-1
            // });
            // const maxParticipantsObj = {
            //     maximumSelectionLength: maxParticipants
            // };
            // $(`#events${i}TeamRegisterForm`).select2(maxParticipantsObj, {
            //     allowClear: true
            // });
        }
    }
    return html;
}

function displayTeamRegistrationButton(event, i) {

    let html = ``;
    if (userDetails && isInTeam) {
        html += `<button id="events${i}TeamRegisterButton" class="btn btn-outline-success" onclick="teamRegFormSubmit(${i}, ${event.id}, ${event.minParticipants}, ${event.maxParticipants})">Register</button>`
    }
    return html;
}


function teamRegFormSubmit(i, eventId, minP, maxP) {
    const minParticipants = minP;
    const maxParticipants = maxP;
    const participants = $(`#events${i}TeamRegisterForm`).select2('data');
    const indices = [];
    participants.forEach((part) => {
        indices.push(Number(part.id));
    });

    if (indices.length < minParticipants || indices.length > maxParticipants) {
        $(`#events${i}TeamRegisterErrMsg`).text(`Number of allowed participants: ${minParticipants} - ${maxParticipants}`).css('color', 'red');
    } else {
        let leaderFound = false;
        const members = [];
        indices.forEach((i) => {
            if (teamDetails.teamMembers[i].email === userDetails.email) leaderFound = true;
            members.push({
                email: teamDetails.teamMembers[i].email,
                bitotsavId: teamDetails.teamMembers[i].bitotsavId
            });
        });
        if (leaderFound === false) {
            $(`#events${i}TeamRegisterErrMsg`).text('Event leader not selected!').css('color', 'red');
        } else {
            const url = "https://bitotsav.in";
            $.ajax({
                url: url + "/api/dash/register",
                method: "POST",
                headers: {
                    'x-access-token': token
                },
                data: {
                    eventId: eventId,
                    participants: members
                },
                crossDomain: true,
                success: function (res) {
                    console.log(res);
                    if (res.status === 200) {
                        $(`#events${i}TeamRegisterErrMsg`).text(res.message).css('color', 'green');
                        $(`#events${i}TeamRegisterButton`).prop("disabled", true);
                        setTimeout(function () {
                            window.location.reload();
                        }, 2000);
                    } else {
                        $(`#events${i}TeamRegisterErrMsg`).text(res.message).css('color', 'red');
                    }
                },
                error: function (err) {
                    $(`#events${i}TeamRegisterErrMsg`).text(res.message).css('color', 'red');
                }
            });
        }
    }
}


function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

var windowUrl = window.location.href;
var queryParam = getParameterByName("q", windowUrl);
console.log(queryParam);

function eventdetails(event, i, s) {
    let duration = event.duration;
    let date = Number(duration.slice(0, 2)) - 13;
    let time = duration.slice(6);
    let imageName = event.imageName.slice(0, event.imageName.lastIndexOf("."));
    let pointsOrCash = {
        name: '',
        value: ''
    };
    if (!event.points || event.points.toLowerCase() === 'none') {
        pointsOrCash.name = 'PRIZES WORTH:';
        pointsOrCash.value = '&#8377;&nbsp;' + event.cashPrize;
    } else {
        pointsOrCash.name = 'POINTS:';
        pointsOrCash.value = event.points;
    }


    return (`                                                                                    
    <div class="col-md-4">
        <div class="card" style="margin-bottom: 20px">
            <img class="card-img-top img-fluid" height="300" src="./images/Events/allEvents/${event.imageName}"
                alt="${event.name}">
            <div class="card-body">
                <h5>${event.name}</h5>
                <button data-toggle="modal" href="#events${i}Modal" class="btn btn-outline-primary">Show Details</button>


                <button type="button" class="btn btn-outline-success" data-toggle="modal"
                    data-target="#events${i}TeamRegisterModal">
                    Team Reg
                </button>


                <button type="button" class="btn btn-outline-success" data-toggle="modal"
                    data-target="#events${i}SoloRegisterModal">
                    Solo Reg
                </button>

            </div>
        </div>
        <div class="modal fade" id="events${i}Modal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel"
            aria-hidden="true">
            <div class="modal-dialog modal-lg" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalLabel">${event.name}</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <table class="table">
                            <tbody>
                                <tr>
                                    <td class="text">EVENT CATEGORY:</td>
                                    <td class="text-inner">${capitalizeFirstLetter(event.category)}</td>
                                </tr>
                                <tr>
                                    <td class="text">DAY:</td>
                                    <td class="text-inner">${date}</td>
                                </tr>
                                <tr>
                                    <td class="text">TIME:</td>
                                    <td class="text-inner">${time}</td>
                                </tr>
                                <tr>
                                    <td class="text">${pointsOrCash.name}</td>
                                    <td class="text-inner">${pointsOrCash.value}</td>
                                </tr>
                                <tr>
                                    <td class="text">DESCRIPTION:</td>
                                    <td class="text-inner" style="text-align:left;">${event.description}</td>
                                </tr>
                                <tr>
                                    <td class="text">RULES AND REGULATIONS:</td>
                                    <td class="text-inner" style="text-align:left;">
                                        ${event["rulesAndRegulations"].replace(/\n/g, "<p class='rulesAndReg'>")}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div class="modal-footer">
                        ${event.contactInformation.replace(/\n/g, "<br>")}
                    </div>
                </div>
            </div>
        </div>



        <div class="modal fade" id="events${i}TeamRegisterModal" tabindex="-1" role="dialog"
            aria-labelledby="events${i}TeamRegisterModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-lg" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="events${i}TeamRegisterModalLabel">Registration for
                            ${event.name.toUpperCase()}</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div id="regModalBody${i}">
                            ${displayMembers(event,i)}
                            <br><p id="events${i}TeamRegisterErrMsg"></p>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-outline-dark" data-dismiss="modal">Close</button>
                        ${displayTeamRegistrationButton(event,i)}
                    </div>
                </div>
            </div>
        </div>



        <div class="modal fade" id="events${i}SoloRegisterModal" tabindex="-1" role="dialog"
            aria-labelledby="events${i}SoloRegisterModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-lg" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="events${i}SoloRegisterModalLabel">Registration for
                            ${event.name.toUpperCase()}</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        ...
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-outline-dark" data-dismiss="modal">Close</button>
                        <button type="button" class="btn btn-outline-success">Register</button>
                    </div>
                </div>
            </div>
        </div>


    </div>
    `);
}

function getEventByCategory() {
    if (queryParam) {
        queryParam = queryParam.toLowerCase();
        var url1 = "https://bitotsav.in";
        $.ajax({
            url: url1 + "/api/events/getEventByCategory?category=" + queryParam,
            method: "GET",
            crossDomain: true,
            success: function (res) {
                console.log(res);
                if (res.status === 200) {
                    for (i = 0; i < res.data.length; i++) {
                        $(".row").append(eventdetails(res.data[i], i, queryParam));
                    }

                    // Open Event Modal
                    // var ind = windowUrl.lastIndexOf("#");
                    // console.log(windowUrl);
                    // if (ind !== -1) {
                    //     var hashParam = windowUrl.substr(ind + 1);
                    //     console.log(hashParam);
                    //     if (hashParam.includes("events")) {
                    //         $(`#${hashParam}`).modal('show');
                    //     }
                    // }

                    $('.js-example-basic-multiple').select2();
                    $('body').addClass('loaded');                    
                }
            },
            error: function (err) {
                alert("Some Error Occured, while fetching Event Details");
            }
        });
    }
}





// $(document).ready(function () {
//     // Open Event Modal

// });

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}