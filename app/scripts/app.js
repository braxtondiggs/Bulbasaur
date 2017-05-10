'use strict';
angular.module('bulbasaur', [
    'ngAnimate',
    'ngMessages',
    'ngRoute',
    'angularMoment',
    'ngTextTruncate',
    'angular-loading-bar',
    'duScroll',
    'angulartics',
    'angulartics.google.analytics',
    'highcharts-ng',
    'angularMoment'
  ])
  .config(function($routeProvider, $locationProvider, cfpLoadingBarProvider) {
    $routeProvider.when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        controllerAs: 'main'
      })
      .otherwise({
        redirectTo: '/'
      });
    $locationProvider.html5Mode(true);
    cfpLoadingBarProvider.spinnerTemplate = '<div class="loader"><span>{</span><span>}</span></div>';
    new WOW()
      .init();

    moment.updateLocale('en', {
      relativeTime: {
        y: '1 year'
      }
    });
  });
