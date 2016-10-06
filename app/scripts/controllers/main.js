'use strict';
/*global $:false*/
function onLoad() {
  $(window).scroll(function() {
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
  $(".navbar-toggle").click(function() {
    $(".navbar-collapse").slideToggle();
  });
  $('.scroll').click(function(e) {
    e.preventDefault();
    $('html,body').animate({
      scrollTop: $(this.hash).offset().top
    }, 500);
  });

  $(window).scroll(function() {
    if ($(this).scrollTop() > 50) {
      $('.menu').fadeIn();

    } else {
      $('.menu').fadeOut();
    }
    if ($(this).scrollTop() > 550) {
      $('.second').addClass('fade-in2');
    }
    if ($(this).scrollTop() > 1000) {
      $('.exp').addClass('left-new');
    }
    if ($(this).scrollTop() > 2000) {
      $('.works').addClass('left-new2');
    }
  });
  /*$('#contact-container button').on('click', function() {
      $.ajax({
          type: "POST",
          url: "index.php/email",
          data: $('#contact-form').serialize()
      }).done(function() {
          $('#contact-form').fadeOut('slow', function() {
              $('#confirmation').fadeIn('slow');
          });
      });
      return false;
  });*/
}
angular.module('bulbasaur').controller('MainCtrl', ['$scope', '$http', '$timeout', function($scope, $http, $timeout) {
  $timeout(function() {
    onLoad();
  }, 500);
  var time = new Date();
  $scope.myForm = {};
  $scope.age = parseInt(time.getFullYear() - 1988, 10);
  $scope.submit = function() {
    $('#contact-form').fadeOut('slow', function() {
      $('#confirmation').fadeIn('slow');
    });
  };
  $http.get('json/data.json').then(function(data) {
    $scope.experiences = data.data.employment;
    $scope.projects = data.data.projects;
  });
}]);
