const year = new Date().getFullYear();
const start_date = new Date((year + 1), 1, 14).getTime();

let timer = setInterval(function () {

    const today = new Date().getTime();
    const diff = start_date - today;

    let days = Math.floor(diff / (1000 * 60 * 60 * 24));
    let hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    let minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    let seconds = Math.floor((diff % (1000 * 60)) / 1000);

    // display
    document.getElementById("timer").innerHTML =
        "<div class=\"col-sm-3 days\"> \
  <div class=\"numbers\">" + days + "</div>days</div> \
<div class=\"col-sm-3 hours\"> \
  <div class=\"numbers\">" + hours + "</div>hours</div> \
<div class=\"col-sm-3 minutes\"> \
  <div class=\"numbers\">" + minutes + "</div>minutes</div> \
<div class=\"col-sm-3 seconds\"> \
  <div class=\"numbers\">" + seconds + "</div>seconds</div> \
</div>";

}, 100);