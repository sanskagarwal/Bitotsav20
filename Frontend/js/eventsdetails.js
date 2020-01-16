var p=window.location.href;
console.log(p);
console.log(p.indexOf("?"));
var t=(p.length);
var l=(p.indexOf("="))
console.log(l);
var i;
var s='';
for(i=l+1;i<t;i++)
{
   s=s+p[i];
}
console.log(s);

var url1= "https://bitotsav.in";
            $.ajax({
                
                url: url1+"/api/events/getEventByCategory?category="+s,
                method:"GET",
                crossDomain:true,
                success: function(res) {
                    for (i = 0; i < res.data.length; i++) {
                    $(".wrap").append(eventdetails(res.data[i], i, s));
                    
                }
            },
            error: function(err) {
                alert("Some Error Occured, while fetching Event Details");
            }
        
        });
        
        function eventdetails(events, i , s) {
            return (`  
           
            <div class="box two">
        
       
            <h1>${events.name}</h1>
            <br>
             <h2> (Events conducted by ${events.eventCategory})</h2>
           
             <br><br>

             <a class="button" href="#events${i}Modal" style="color:black; font-size:0.8em; font-weight:800;">More Details</a>
             <div class="popup" id="events${i}Modal">
               <div class="popup-inner">
                 <div class="popup__photo">
                   <img src="images/Events/${events.name}.jpg" onerror=this.src="images/Events/${events.name}.png" onerror=this.src="images/Events/${events.name}.jpeg" alt="Card image" class="img-responsive">
                 </div>
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


        $(document).ready(function(){
            $(".button").click(function(){
              $("#events${i}Modal").css({"visibilty": " visible", "opacity":"1"});
            });
          });


          $('.two').css({'background': 'url(../images/Events/Dhwani.jpg)', 'background-repeat': 'no repeat'});
          
        