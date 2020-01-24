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
        } else {
            html += `<p>You must be in registered in a team to participate in this event!</p>`;
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

// Solo Registration


//to insert options into number of participants select ranging from minP and maxP
function insertSoloRegTeamSizeOptions(minP, maxP) {
    let html = ``;
    for (let i = minP; i <= maxP; i++) {
        html += `<option value="${i.toString()}">${i.toString()}</option>`
    }
    return html;
}


//called whenever number of participants selected ........to enable initial required input tags and rest input tags remain disabled according to the number of participants selected
function soloRegTeamSizeChangeHandler(i, maxP) {
    const size = Number($(`#events${i}soloRegTeamSizeSelect`).val());
    console.log(size);
    const max = Number(maxP);
    for (let j = 2; j <= size; j++) {
        $(`#events${i}SoloRegMember${j}Email`).prop("disabled", false);
        $(`#events${i}SoloRegMember${j}BitotsavId`).prop("disabled", false);
    }
    for(let j=size+1;j<=max;j++) {
        $(`#events${i}SoloRegMember${j}Email`).prop("disabled", true);
        $(`#events${i}SoloRegMember${j}BitotsavId`).prop("disabled", true);
    }
}


//to append input tags so that participants details can ne entered
function soloRegInput(i, j) {
    let html = ``;

    if (j === 1) {
        html += `
        <br>
        <div class="form-row">
            <div class="col-md-6 mb-3">
                <label for="events${i}SoloRegMember${j}Email">Email</label>
                <div class="input-group">
                <div class="input-group-prepend">
                    <span class="input-group-text" id="inputGroupPrepend">@</span>
                </div>
                <input type="email" class="form-control" id="events${i}SoloRegMember${j}Email" value="${userDetails.email}" aria-describedby="inputGroupPrepend" required disabled>
                </div>
            </div>
            <div class="col-md-6 mb-3">
                <label for="events${i}SoloRegMember${j}BitotsavId">BitotsavId</label>
                <div class="input-group">
                <div class="input-group-prepend">
                    <span class="input-group-text" id="inputGroupPrepend">BIT-</span>
                </div>
                <input type="number" class="form-control" id="events${i}SoloRegMember${j}BitotsavId" value="${userDetails.bitotsavId}" aria-describedby="inputGroupPrepend" required disabled>
                </div>
            </div>
        </div>
        `;
    } else {
        html += `
        <div class="form-row">
            <div class="col-md-6 mb-3">
                <div class="input-group">
                <div class="input-group-prepend">
                    <span class="input-group-text" id="inputGroupPrepend">@</span>
                </div>
                <input type="email" class="form-control" id="events${i}SoloRegMember${j}Email" placeholder="Email" aria-describedby="inputGroupPrepend" required disabled>
                </div>
            </div>
            <div class="col-md-6 mb-3">
                <div class="input-group">
                <div class="input-group-prepend">
                    <span class="input-group-text" id="inputGroupPrepend">BIT-</span>
                </div>
                <input type="number" class="form-control" id="events${i}SoloRegMember${j}BitotsavId" placeholder="BitotsavId" aria-describedby="inputGroupPrepend" required disabled>
                </div>
            </div>
        </div>
        `;
    }

    return html;

}


//to handle submission of solo reg form
function soloRegFormSubmit(i, eventId) {
    const pSize = Number($(`#events${i}soloRegTeamSizeSelect`).val());
    let participantsArr = [];

    for (let j = 1; j <= pSize; j++) {
        participantsArr.push({
            email: $(`#events${i}SoloRegMember${j}Email`).val().toString(),
            bitotsavId: $(`#events${i}SoloRegMember${j}BitotsavId`).val().toString()
        });
    }

    const url = "https://bitotsav.in";
    $.ajax({
        url: url + "/api/dash/register",
        method: "POST",
        headers: {
            'x-access-token': token
        },
        data: {
            eventId: eventId,
            participants: participantsArr
        },
        crossDomain: true,
        success: function (res) {
            console.log(res);
            if (res.status === 200) {
                $(`#events${i}SoloRegisterErrMsg`).text(res.message).css('color', 'green');
                $(`#events${i}SoloRegisterButton`).prop("disabled", true);
                setTimeout(function () {
                    window.location.reload();
                }, 2000);
            } else {
                $(`#events${i}SoloRegisterErrMsg`).text(res.message).css('color', 'red');
            }
        },
        error: function (err) {
            $(`#events${i}SoloRegisterErrMsg`).text(res.message).css('color', 'red');
        }
    });

}



//to handle submit button
function displaySoloEventRegistrationButton(event, i) {

    let html = ``;
    if (userDetails) {
        html += `<button id="events${i}SoloRegisterButton" class="btn btn-outline-success" onclick="soloRegFormSubmit(${i}, ${event.id})">Register</button>`
    }
    return html;
}




function displaySoloEventParticipantsForm(event, i) {
    let html = ``;
    if (userDetails === null) {
        html += `<p>You must be logged in to register in any event!</p>`;
    } else {

        html += `
                <p>Number of allowed participants: ${event.minParticipants} - ${event.maxParticipants}.</p>
                <p>"${userDetails.name}" will be the event leader.</p>
                <p>Please provide the details of the other participants: </p>
            `;

        const numberOfParticipantsSelect = `
        <select class="custom-select" required id="events${i}soloRegTeamSizeSelect" onchange="soloRegTeamSizeChangeHandler(${i}, ${event.maxParticipants})">
            <option value="" disabled selected>Choose the number of participants: </option>            
            ${insertSoloRegTeamSizeOptions(event.minParticipants, event.maxParticipants)}
        </select>
        `;
        html += numberOfParticipantsSelect;

        let memberInputs = ``;

        for (let j = 1; j <= event.maxParticipants; j++) {
            memberInputs += soloRegInput(i, j);
        }

        html += memberInputs;

        let buttons = `
            <button type="button" class="btn btn-outline-dark" data-dismiss="modal">Close</button>
            ${displaySoloEventRegistrationButton(event,i)}
        `;
        html += buttons;
    }
    return html;
}

// Group Registration

function groupRegister(eventId) {
    $(`#events${i}GroupRegisterButton`).prop("disabled", true);
    const url = "https://bitotsav.in";
    $.ajax({
        url: url + "/api/dash/register",
        method: "POST",
        headers: {
            'x-access-token': token
        },
        data: {
            eventId: eventId,
        },
        crossDomain: true,
        success: function (res) {
            console.log(res);
            if (res.status === 200) {
                $(`#events${i}GroupRegisterErrMsg`).text(res.message).css('color', 'green');
                setTimeout(function () {
                    window.location.reload();
                }, 2000);
            } else {
                $(`#events${i}GroupRegisterErrMsg`).text(res.message).css('color', 'red');
                $(`#events${i}GroupRegisterButton`).prop("disabled", false);
            }
        },
        error: function (err) {
            $(`#events${i}GroupRegisterErrMsg`).text(res.message).css('color', 'red');
            $(`#events${i}GroupRegisterButton`).prop("disabled", false);
        }
    });
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
    let duration = event.duration, date, time;
    if(duration[0] === "@") {
        let colonIndex = duration.indexOf(':')
        date = duration.slice(1, duration.indexOf(':'));
        time = duration.slice(colonIndex+1);
    } else {
        date = Number(duration.slice(0, 2)) - 13;
        time = duration.slice(6);
    }
    let imageName = event.imageName.slice(0, event.imageName.lastIndexOf("."));
    let pointsOrCash = {
        name: '',
        value: ''
    };
    if(event.id === 27) { // Let's Scribble
        pointsOrCash.name = 'POINTS & PRIZES:';
        pointsOrCash.value = event.points + ', &#8377;&nbsp;' + event.cashPrize;
    } else if (!event.points || event.points.toLowerCase() === 'none') {
        pointsOrCash.name = 'PRIZES WORTH:';
        pointsOrCash.value = '&#8377;&nbsp;' + event.cashPrize;
    } else {
        pointsOrCash.name = 'POINTS:';
        pointsOrCash.value = event.points;
    }

    let finalRegButton, groupRegisterButton="";

    const userEvents = userDetails.soloEventsRegistered.concat(userDetails.teamEventsRegistered);
    if(userEvents.find((val) => val.eventId = event.id ) !== undefined ) {
        finalRegButton = `<button type="button" disabled class="btn btn-outline-success">Registered</button>`;
    } else if(event.group === 1) {
        let teamRegText = "Group Register";
        finalRegButton = `<button id="teamRegisterModalButton" type="button" class="btn btn-outline-success" data-toggle="modal"
        data-target="#events${i}GroupRegisterModal">
        ${teamRegText}
        </button>`;

        if(userDetails.isTeamLeader) {
            groupRegisterButton = `<button class="btn btn-outline-success" onclick="groupRegister(${event.id})">Register your team</button>`;
        }
    } else if(event.individual === 1) {
        let soloRegText = "Solo Register";
        finalRegButton = `
            <button id="soloRegisterModalButton" type="button" class="btn btn-outline-success" data-toggle="modal"
            data-target="#events${i}SoloRegisterModal">
            ${soloRegText}
            </button>`;
    } else if(isInTeam) {
        let teamRegText = "Team Register";
        finalRegButton = `<button id="teamRegisterModalButton" type="button" class="btn btn-outline-success" data-toggle="modal"
        data-target="#events${i}TeamRegisterModal">
        ${teamRegText}
        </button>`;
    } else { // Solo
        let soloRegText = "Solo Register";
        finalRegButton = `
        <button id="soloRegisterModalButton" type="button" class="btn btn-outline-success" data-toggle="modal"
        data-target="#events${i}SoloRegisterModal">
        ${soloRegText}
        </button>`;
    }
    


    return (`
    <div class="col-md-4">
        <div class="card" style="margin-bottom: 20px">
            <img class="card-img-top img-fluid" height="300" src="./images/Events/allEvents/${event.imageName}"
                alt="${event.name}">
            <div class="card-body">
                <h5>${event.name}</h5>
                <button data-toggle="modal" href="#events${i}Modal" class="btn btn-outline-primary">Show Details</button>

                ${finalRegButton}

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
                        <p>Since this event carries points and is to be considered for Bitotsav Championship, you must be a part of a team.</p>
                        <p>Proceed to register your team for this event.</p>
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

        <div class="modal fade" id="events${i}GroupRegisterModal" tabindex="-1" role="dialog"
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
                        <p>It is a Flagship event, only the team leader can register for the
                        event. After successful registration, the team leader must mail documents,
                        photos etc. to <a href="mailto:events@bitotsav.in" target="_blank">events@bitotsav.in</a></p>

                        ${groupRegisterButton}

                        <p id="events${i}GroupRegisterErrMsg"></p>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-outline-dark" data-dismiss="modal">Close</button>
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
                        <p>${event.individual === 1 ? 'This event is independent of being in championship team or not.' : 'You can either participate as an independent team or championship team (requires to create a championship team).'}</p>
                        <p>Please provide the details of whomsoever you want to participate with in this event.</p>
                        ${displaySoloEventParticipantsForm(event, i)}
                        <br><p id="events${i}SoloRegisterErrMsg"></p>
                    </div>
                    <div class="modal-footer">
                        
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

                    $('.js-example-basic-multiple').select2();
                    $('body').addClass('loaded');
                }
            },
            error: function (err) {
                $('body').addClass('loaded');
                alert("Some Error Occured, while fetching Event Details");
            }
        });
    }
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}