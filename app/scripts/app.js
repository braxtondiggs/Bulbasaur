'use strict';

angular
  .module('bulbasaur', [
    'ngAnimate',
    'ngMessages',
    'ngRoute',
    'angularMoment',
    'ngTextTruncate'
  ])
  .config(function($routeProvider, $locationProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        controllerAs: 'main'
      })
      .otherwise({
        redirectTo: '/'
      });
    $locationProvider.html5Mode(true);
  });
