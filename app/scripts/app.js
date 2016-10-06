'use strict';

angular
    .module('bulbasaur', [
        'ngAnimate',
        'ngMessages',
        'ngResource',
        'ngRoute',
        'ngSanitize',
        'ngTouch'
    ])
    .config(function($routeProvider, $locationProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'views/main.html',
                controller: 'MainCtrl',
                controllerAs: 'main'
            })
            .when('/resume', {
                templateUrl: 'views/resume.html',
                controller: 'ResumeCtrl',
                controllerAs: 'resume'
            })
            .otherwise({
                redirectTo: '/'
            });
        $locationProvider.html5Mode(true);
    });
