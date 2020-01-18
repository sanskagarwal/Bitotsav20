function getParameterByName(name, url) {
  if (!url) url = window.location.href;
  name = name.replace(/[\[\]]/g, '\\$&');
  var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
  results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

var queryParam = getParameterByName("q", window.location.href);
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

function eventdetails(events, i , s) {
  return (`
    <div class="box two">
    <h1>${events.name}</h1>
    <br>
    <img src="images/Events/${events.name}.jpg" onerror=this.src="images/Events/${events.name}.png" onerror=this.src="images/Events/${events.name}.jpeg" alt="Card image" class="img-responsive" width="200" height="200">
    <br>
    <h2> (Events conducted by ${events.eventCategory})</h2>

    <br>

    <a class="button" href="#events${i}Modal" style="color:black; font-size:0.8em; font-weight:800;">More Details</a>
    <div class="popup" id="events${i}Modal">
    <div class="popup-inner">

    <div class="popup__text">
    <strong style="font-size:2.3em; color:black;">${events.name}</strong>
    <br><br> 
    <p> <strong><span class="text">EVENT CATEGORY:</span><span class="text-inner">${events.category}</span></strong>
    <br><br>
    <strong><span class="text">VENUE:</span><span class="text-inner">${events.venue}</span></strong>
    <br><br>
    <strong><span class="text">DURATION:</span><span class="text-inner">${events.duration}</span></strong>
    <br><br>
    <strong><span class="text">DESCRIPTION:</span><span class="text-inner">${events.description}</span></strong>
    <br><br>
    <strong><span class="text">RULES AND REGULATIONS:</span><span class="text-inner">${events["rules and regulations"]}</span></strong>
    <br><br>
    <strong><span class="text">CONTACT INFORMATION:</span><span class="text-inner">${events["contact information"]}</span></strong>
    <br><br>
    </p>
    </div>
    <a class="popup__close" href="#">X</a>
    </div>
    </div>


    </div>

    `);
}


if(queryParam) {
  queryParam = queryParam.toLowerCase();
  var url1= "https://bitotsav.in";
  $.ajax({
    url: url1+"/api/events/getEventByCategory?category="+queryParam,
    method:"GET",
    crossDomain:true,
    success: function(res) {
      if(res.status === 200) {
        for (i = 0; i < res.data.length; i++) {
          $(".wrap").append(eventdetails(res.data[i], i, s));
        }
      }
    },
    error: function(err) {
      alert("Some Error Occured, while fetching Event Details");
    }
  });
}

$(document).ready(function(){
  $(".button").click(function(){
    $(`#events${i}Modal`).css({"visibilty": " visible", "opacity":"1"});
  });
});


$('.two').css({'background': 'url(../images/Events/Dhwani.jpg)', 'background-repeat': 'no repeat'});

