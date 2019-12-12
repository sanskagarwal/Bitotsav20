
//form ajax
function execute() {

	var name = $("#name").val();
	var college = $("#college").val();
	var phone = $("#phone").val();
	var email = $("#email").val();

	var q1 = $("#q1").val();
	var q2 = $("#q2").val();
	var q3 = $("#q3").val();
	var q4 = $("#q4").val();
	var q5 = $("#q5").val();



	if (name === "") {
		$("#name").show();
		return;
	}

	if (college === "") {
		$("#college").show();
		return;
	}


	if (email === "") {
		$("#email").show();
		return;
	}


	if (phone === "") {
		$("#phone").show();
		return;
	}

	// if (phone.length != 10) {
	// 	$("#errormessage).text("enter 10 digit number");
	// 	return
	// }

	let url1 = "http://localhost:5000";
	$.ajax({
		url: url1 + "/sap/register",
		method: "POST",
		data: {
			name: name,
			email: email,
			phone: phone,
			college: college,
			ans1: q1,
			ans2: q2,
			ans3: q3,
			ans4: q4,
			ans5: q5
		},
		crossDomain: true,
		success: function (res) {
			console.log(res);
		},
		error: function (err) {
			console.log(err);
			alert(err);
		}
	});
}