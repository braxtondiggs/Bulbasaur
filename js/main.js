$(function() {
	$(window).scroll(function(){
		if ($(this).scrollTop() > 100) {
			$('[data-js=scroll-show]').addClass('scroll-show').fadeIn('slow');
		} else {
			$('[data-js=scroll-show]').removeClass('scroll-show').fadeOut('slow');
		}
	});
	var navBarYOffset = $("#work").offset().top;
	$(window).scroll(function() {
		if ($(window).scrollTop() > navBarYOffset) {
			$('body').addClass('navbar-fixated');
		} else {
			$('body').removeClass('navbar-fixated');
		}
	});
	$(".navbar-toggle").click(function(){
		$(".navbar-collapse").slideToggle();
	});
	$('.scroll').click(function(e) {
		e.preventDefault();
		$('html,body').animate({scrollTop:$(this.hash).offset().top}, 500);
	});

	$(window).scroll(function() { 
		if ($(this).scrollTop()>50) {
			$('.menu').fadeIn();

		} else{
			$('.menu').fadeOut();
		}
		if ($(this).scrollTop()>550) {
		 	$('.second').addClass('fade-in2');
		}
		if ($(this).scrollTop()>1000) {
		 	$('.exp').addClass('left-new');
		}
		if ($(this).scrollTop()>2000) {
		 	$('.works').addClass('left-new2');
		}
	});
	$('#contact-container button').on('click', function() {
		$.ajax({
			type: "POST",
			url: "index.php/email",
			data: $('#contact-form').serialize()
		}).done(function(data) {
			$('#contact-form').fadeOut('slow', function() {
				$('#confirmation').fadeIn('slow');
			});
		});
		return false;
	});

});