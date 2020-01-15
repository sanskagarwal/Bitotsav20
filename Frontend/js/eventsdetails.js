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

var url1= "http://localhost:5000/api/events";
            $.ajax({
                
                url: url1+"/getEventByCategory?category="+s,
                method:"GET",
                crossDomain:true,
                success: function(res) {
                    for (i = 0; i < res.data.length; i++) {
                    $(".card-deck").append(eventdetails(res.data[i], i));
                 
                }
            },
            error: function(err) {
                alert("Some Error Occured, while fetching Event Details");
            }
        
        });
        
        function eventdetails(events, i) {
            return (`  
            
                            <div class="card text-center col-lg-4 col-md-4 col-xs-12">
                                <img class="card-img-top" src="images/Events/${events.name}.jpg" onerror=this.src="images/Events/${events.name}.png" onerror=this.src="images/Events/${events.name}.jpeg" alt="Card image">
                                <br>
                                <h1 style="color:white; font-size:1.3em">${events.name}</h1>
                                <div class="card-body">
                                    <a href="#" class="btn btn-outline-success stretched-link" data-toggle="modal" data-target="#events${i}Modal">More Details</a>
                                </div>
        
        
        
                                <!-- The Modal -->
                                <div class="modal" id="events${i}Modal">
                                    <div class="modal-dialog modal-lg">
                                        <br>
                                        <div class="modal-content">
        
                                            <!-- Modal Header -->
                                            <div class="modal-header ">
                                                <h4 class="modal-title text-center">${events.name}</h4>
                                                <button type="button" class="close" data-dismiss="modal">&times;</button>
                                            </div>
        
                                            <!-- Modal body -->
                                            <div class="modal-body">
                                                <div class="row">
                                                    
                                                   <div class="col-md-12 col-12">
                                                       
                                                        <strong class="text-center" style="font-size:1.2em">CATEGORY:</strong> <h4>${events.category}</h4>
                                                        <br>
                                                        <strong class="text-center" style="font-size:1.2em">VENUE:</strong> <h4>${events.venue}</h4>
                                                        <br>
                                                        <strong class="text-center" style="font-size:1.2em">DURATION:</strong> <h4>${events.duration}</h4>
                                                        <br>
                                                        <strong class="text-center" style="font-size:1.2em">FACULTY ADVISORS:</strong> <h4>${events["faculty advisors"]}</h4>
                                                        <br>
                                                        <strong class="text-center" style="font-size:1.2em">CLUB:</strong> <h4>${events.club}</h4>
                                                        <br>
                                                        <strong class="text-center" style="font-size:1.2em">DESCRIPTION:</strong> <h4 style="letter-spacing:0.5mm;">${events.description}</h4>
                                                        <br>
                                                        <strong class="text-center" style="font-size:1.2em;">RULES AND REGULATIONS:</strong> <h4 style="letter-spacing:0.5mm;">${events["rules and regulations"]}</h4>
                                                        <br>
                                                        <br>
                                                        <strong class="text-center" style="font-size:1.2em">CONTACT INFORMATION:</strong> <h4>${events["contact information"]}</h4>
                                                        <br>
                                                        <strong class="text-center" style="font-size:1.2em">RESOURSES REQUIRED:</strong> <h4 style="letter-spacing:0.5mm;">${events["resources required"]}</h4>
                                                        <br>
                                                    </div>
                                                </div>
                                            </div>
        
                                           
        
                                        </div>
                                    </div>
                                </div>
                             </div>  
                   
                              
        `);
        }