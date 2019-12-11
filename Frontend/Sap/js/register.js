$(function () {
	$('.form-holder').delegate("input", "focus", function () {
		$('.form-holder').removeClass("active");
		$(this).parent().addClass("active");
	})
})
// Preloader (if the #preloader div exists)
$(window).on('load', function () {
	if ($('#preloader').length) {
		$('#preloader').delay(100).fadeOut('slow', function () {
			$(this).remove();
		});
	}
});
// Header scroll class
$(window).scroll(function () {
	if ($(this).scrollTop() > 100) {
		$('#header').addClass('header-scrolled');
	} else {
		$('#header').removeClass('header-scrolled');
	}
});

if ($(window).scrollTop() > 100) {
	$('#header').addClass('header-scrolled');
}

// Smooth scroll for the navigation and links with .scrollto classes
$('.main-nav a, .mobile-nav a, .scrollto').on('click', function () {
	if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
		var target = $(this.hash);
		if (target.length) {
			var top_space = 0;

			if ($('#header').length) {
				top_space = $('#header').outerHeight();

				if (!$('#header').hasClass('header-scrolled')) {
					top_space = top_space - 20;
				}
			}

			$('html, body').animate({
				scrollTop: target.offset().top - top_space
			}, 1500, 'easeInOutExpo');

			if ($(this).parents('.main-nav, .mobile-nav').length) {
				$('.main-nav .active, .mobile-nav .active').removeClass('active');
				$(this).closest('li').addClass('active');
			}

			if ($('body').hasClass('mobile-nav-active')) {
				$('body').removeClass('mobile-nav-active');
				$('.mobile-nav-toggle i').toggleClass('fa-times fa-bars');
				$('.mobile-nav-overly').fadeOut();
			}
			return false;
		}
	}
});

// Navigation active state on scroll
var nav_sections = $('section');
var main_nav = $('.main-nav, .mobile-nav');
var main_nav_height = $('#header').outerHeight();

$(window).on('scroll', function () {
	var cur_pos = $(this).scrollTop();

	nav_sections.each(function () {
		var top = $(this).offset().top - main_nav_height,
			bottom = top + $(this).outerHeight();

		if (cur_pos >= top && cur_pos <= bottom) {
			main_nav.find('li').removeClass('active');
			main_nav.find('a[href="#' + $(this).attr('id') + '"]').parent('li').addClass('active');
		}
	});
});

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
	// 	$("#phone-error").text("enter 10 digit number");
	// 	return
	// }

	let url1 = "http://localhost:";
	$.ajax({
		url: url1 + "/",
		method: "POST",
		data: {

			name: name,
			email: email,
			phone: phone,
			college: college,
			q1: q1,
			q2: q2,
			q3: q3,
			q4: q4,
			q5: q5


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