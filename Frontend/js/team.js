let url1 = "https://bitotsav.in/api/team";
$.ajax({
    url: url1 + "/allCoreTeam",
    method: "GET",
    cors: true,
    success: function (res) {
        res.details.sort(function (a, b) {
            var nameA = a.team.toLowerCase(), nameB = b.team.toLowerCase()
            if (nameA < nameB) //sort string ascending
                return -1
            if (nameA > nameB)
                return 1
            return 0 //default return value (no sorting)
        })
        console.log(res);
        var x = res.details.map(findTeam);
        function findTeam(item) {
            return item.team;
        }
        res.details.team;
        const unique = (value, index, self) => {
            return self.indexOf(value) === index
        }
        var team = x.filter(unique);
        console.log(team);
        if (res.status === 200) {

            for (j = 0; j < team.length; j++) {
                for (i = 0; i < res.details.length; i++) {
                    if (team[j] === res.details[i].team) {
                        $(`#t${j}`).append(` <div class="col-lg-4 col-md-6">
            <div class="speaker">
                <div style="height:250px;">
                    <img src="images/team/${res.details[i].image}" alt="TeamMember${i}" class="img-fluid">
                </div>
                <div class="details">
                <h2>${res.details[i].name}</h2>
                <p style="text-align:"right">${res.details[i].phone}</p>   
                    <div class="social">
                        <a href="${res.details[i].fbProfile}" target="_blank"><i class="fab fa-facebook-f"></i></a>
                        <a href="mailto:${res.details[i].email}" target="_blank"><i class="fas fa-envelope"></i></a>
                    </div>
                </div>
            </div>
        </div>`)
                    }
                }
                $(`#t${j}`).prepend(`<div class="text-center hc col-md-12">
                <h3  style="display:block">${team[j]} Team</h3>
                </div>
                <br/>
                <br/>`);
            }
        }
    },
    error: function (err) {
        console.log(err);
    }
});
