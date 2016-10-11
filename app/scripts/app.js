'use strict';

angular
  .module('bulbasaur', [
    'ngAnimate',
    'ngMessages',
    'ngRoute',
    'chart.js',
    'angularMoment',
    'ngTextTruncate',
    'angular-loading-bar'
  ])
  .config(function($routeProvider, $locationProvider, cfpLoadingBarProvider) {
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
    cfpLoadingBarProvider.spinnerTemplate = '<div class="loader"><span>{</span><span>}</span></div>';
  });
