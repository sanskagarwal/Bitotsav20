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

// var url=window.location.href;
// console.log(url);
// console.log(p.indexOf("?"));
// var t=(p.length);
// var l=(p.indexOf("="))
// console.log(l);
// var i;
// var s='';
// for(i=l+1;i<t;i++)
// {
//  s=s+p[i];
// }
// console.log(s);


function eventdetails(events, i, s) {
    let duration = events.duration;
    let date = Number(duration.slice(0, 2)) - 13;
    let time = duration.slice(6);
    let imageName = events.imageName.slice(0, events.imageName.lastIndexOf("."));
    let pointsOrCash = {
        name: '',
        value: ''
    };
    console.log(events.points)
    if (!events.points || events.points.toLowerCase() === 'none') {
        pointsOrCash.name = 'PRIZES WORTH:';
        pointsOrCash.value = '&#8377;&nbsp;' + events.cashPrize;
    } else {
        pointsOrCash.name = 'POINTS:';
        pointsOrCash.value = events.points;
    }


    return (`                                                                                    
    <div class="col-md-4">
        <div class="card" style="margin-bottom: 20px">
            <img class="card-img-top img-fluid" height="300" src="./images/Events/allEvents/${events.imageName}" alt="${events.name}">
            <div class="card-body">
                <hr>
                ${events.name}
                <br>
                <button data-toggle="modal" data-target="#events${i}Modal" class="btn btn-primary">Show Details</button>
            </div>
        </div>
        <div class="modal fade" id="events${i}Modal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-lg" role="document">
            <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">${events.name}</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <table class="table">
                    <tbody>
                    <tr>
                        <td class="text">EVENT CATEGORY:</td>
                        <td class="text-inner">${capitalizeFirstLetter(events.category)}</td>
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
                        <td class="text-inner" style="text-align:left;">${events.description}</td>
                    </tr>
                    <tr>
                        <td class="text">RULES AND REGULATIONS:</td>
                        <td class="text-inner" style="text-align:left;">${events["rulesAndRegulations"].replace(/\n/g, "<p class='rulesAndReg'>")}</td>
                    </tr>
                    </tbody>
                </table>
            </div>
            <div class="modal-footer">
                ${events.contactInformation.replace(/\n/g, "<br>")}
            </div>
            </div>
        </div>
        </div> 
    </div>
    `);
}

/*
<div class="popup-inner">
                <table style="width:100%" cellpadding="0" cellspacing="0" border="0">
                    <tbody>
                        <tr>
                            <td class="text">EVENT CATEGORY:</td>
                            <td class="text-inner">${capitalizeFirstLetter(events.category)}</td>
                        </tr>
                        <tr>
                            <td class="text">VENUE:</td>
                            <td class="text-inner">${events.venue}</td>
                        </tr>
                        <tr>
                            <td class="text">DATE:</td>
                            <td class="text-inner">${date}</td>
                        </tr>
                        <tr>
                            <td class="text">TIME:</td>
                            <td class="text-inner">${time}</td>
                        </tr>
                        <tr>
                            <td class="text">DESCRIPTION:</td>
                            <td class="text-inner">${events.description}</td>
                        </tr>
                        <tr>
                            <td class="text">RULES AND REGULATIONS:</td>
                            <td class="text-inner">${events["rulesAndRegulations"].replace(/\n/g, "<p class='rulesAndReg'>")}</td>
                        </tr>
                        <tr>
                            <td class="text">CONTACT INFORMATION:</td>
                            <td class="text-inner">${events["contactInformation"]}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            */

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
            }
        },
        error: function (err) {
            alert("Some Error Occured, while fetching Event Details");
        }
    });
}

$(document).ready(function () {
    $(".button").on("click", function () {
        $(`#events${i}Modal`).css({
            "visibilty": "visible",
            "opacity": "1",
            "background": ""
        });
        4

    });





    // Open Event Modal
    var ind = windowUrl.lastIndexOf("#");
    if (ind !== -1) {
        var hashParam = windowUrl.substr(ind + 1);
        console.log(hashParam);
        if (hashParam.includes("events")) {
            $(`#${hashParam}`).css({
                "visibility": "visible",
                "opacity": "1"
            });
        }
    }
});


$('.two').css({
    'background': 'url(../images/Events/Dhwani.jpg)',
    'background-repeat': 'no repeat'
});

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}