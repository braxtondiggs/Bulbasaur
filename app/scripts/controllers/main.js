'use strict';

angular.module('bulbasaur').controller('MainCtrl', ['$scope', '$http', function($scope, $http) {
  var time = new Date();
  $scope.age = parseInt(time.getFullYear() - 1988, 10);
  $scope.submit = function() {
    if ($scope.contactForm.$valid) {
      $http.post('http://meowth1.herokuapp.com/mail', {
        name: $scope.contactForm.name.$viewValue,
        email: $scope.contactForm.email.$viewValue,
        message: $scope.contactForm.message.$viewValue
      }).then(function(data) {
        if (data.status) {
          $scope.submitted = true;
        }
      });
    }
  };
  $http.get('json/data.json').then(function(data) {
    $scope.experiences = data.data.employment;
    $scope.projects = data.data.projects;
    var isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    $scope.likes = _.chunk(data.data.likes, ((isMobile) ? 2 : 3));
    _.forEach($scope.projects, function(project, key) {
      $scope.projects[key].description_modified = _.join(project.description, '<br /><br />');
    });
  });
  $scope.chart = {
    xLabel: {
      backend: ['', [
          ['Yes,'],
          ['I know']
        ],
        [
          ['Promising'],
          ['Maniac']
        ],
        [
          ['Powerful'],
          ['Insider']
        ],
        [
          ['Inspiring'],
          ['Teacher']
        ],
        [
          ['Breath-taking'],
          ['Visionary']
        ]
      ],
      frontend: ['', [
          ['I heard,'],
          ['about it']
        ],
        [
          ['Fast-learning'],
          ['Talent']
        ],
        [
          ['Skilled'],
          ['Craftsman']
        ],
        [
          ['Impressive'],
          ['Virtuoso']
        ],
        [
          ['Mind-blowing'],
          ['Superhero']
        ]
      ]
    },
    labels: {
      backend: ['Android SDK', 'PHP', 'Java', 'Swift', '.NET', 'Rails'],
      frontend: ['Angular JS', 'ReactJS', 'TypeScript', 'SCSS', 'Task Runners', 'CSS3']
    },
    options: {
      tooltips: {
        enabled: false
      },
      responsive: true,
      scales: {
        xAxes: [{
          position: 'top',
          stacked: false,
          gridLines: {
            display: false
          },
          ticks: {
            callback: function(value, index) {
              return $scope.chart.xLabel.frontend[index];
            },
            max: 100,
            min: 0,
            stepSize: 20,
            beginAtZero: false,
            padding: -20,
            fontFamily: 'BandaRegular',
            fontColor: '#1caedd',
            fontStyle: 'bold'
          }
        }],
        yAxes: [{
          gridLines: {
            display: false
          },
          /*ticks: {
            mirror: true
          },*/
          stacked: true,
          categoryPercentage: 1.0,
          barPercentage: 1.0,
          fontFamily: 'BandaRegular',
          fontStyle: 'bold'
        }]
      }
    },
    data: {
      backend: [80, 60, 80, 20, 40, 20],
      frontend: [60, 20, 40, 80, 60, 80]
    },
    override: {
      borderWidth: 0
    }
  };
}]).controller('NavCtrl', ['$scope', '$document', function($scope, $document){
  $document.on('scroll', function() {
    $scope.showHeader = ($document.scrollTop() > 100);
    $scope.$apply();
  });
}]);
