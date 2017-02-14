'use strict';
angular.module('bulbasaur')
  .controller('MainCtrl', ['$scope', '$http', function($scope, $http) {
    var time = new Date();
    $scope.age = parseInt(time.getFullYear() - 1988, 10);
    $scope.skillSelect = 'last7days';
    $scope.submit = function() {
      if ($scope.contactForm.$valid) {
        $http.post('http://meowth1.herokuapp.com/mail', {
            name: $scope.contactForm.name.$viewValue,
            email: $scope.contactForm.email.$viewValue,
            message: $scope.contactForm.message.$viewValue
          })
          .then(function(data) {
            if (data.status) {
              $scope.submitted = true;
            }
          });
      }
    };
    $http.get('json/data.json')
      .then(function(data) {
        $scope.experiences = data.data.employment;
        $scope.projects = data.data.projects;
        var isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
        $scope.likes = _.chunk(data.data.likes, ((isMobile) ? 2 : 3));
        _.forEach($scope.projects, function(project, key) {
          $scope.projects[key].description_modified = _.join(project.description, '<br /><br />');
        });
      });

    function getSkills(range) {
      $http.get('https://wartortle.herokuapp.com?range=' + range)
        .then(function(data) {
          if (data.status === 200) {
            var languages = data.data.Languages;
            var editors = data.data.Editors;
            var timeline = data.data.Timeline;
            var total_count = _.reduce(languages, function(sum, n) {
              return sum + n.total_seconds;
            }, 0);
            _.forEach(languages, function(value, index) {
              languages[index].y = _.round((value.total_seconds / total_count) * 100, 2);
            });
            _.forEach(editors, function(value, index) {
              editors[index].y = _.round((value.total_seconds / total_count) * 100, 2);
            });
            $scope.chartLanguageConfig.series = [{
              data: languages
          }];
            $scope.chartEditorConfig.series = [{
              data: editors
          }];
            $scope.chartDateConfig.series = [{
              showInLegend: false,
              data: _.map(timeline, 'total_seconds')
                .map(function(v) {
                  return _.round(v / 3600, 2);
                })
          }];
            $scope.chartDateConfig.xAxis = {
              categories: _.map(timeline, 'date')
                .map(function(v) {
                  return moment(v)
                    .format('MMM Do');
                })
            };
          }
        });
    }
    getSkills('last7days');
    $scope.skillChange = function(ev) {
      if ($scope.skillSelect !== 'customrange') {
        getSkills($scope.skillSelect);
      } else {}
    };
    $scope.chartLanguageConfig = {
      chart: {
        type: 'pie'
      },
      series: [{
        name: 'Percentage',
        colorByPoint: true,
        data: null
    }],
      tooltip: {
        headerFormat: '{point.key}: <b>{point.percentage:.1f}%</b>',
        pointFormat: ''
      },
      title: {
        text: 'Languages'
      },
      credits: {
        enabled: false
      }
    };
    $scope.chartEditorConfig = {
      chart: {
        type: 'pie'
      },
      series: [{
        name: 'Percentage',
        colorByPoint: true,
        data: null
        }],
      tooltip: {
        headerFormat: '{point.key}: <b>{point.percentage:.1f}%</b>',
        pointFormat: ''
      },
      title: {
        text: 'Editors'
      },
      credits: {
        enabled: false
      }
    };
    $scope.chartDateConfig = {
      chart: {
        type: 'line',
      },
      title: {
        text: 'Coding Activity'
      },
      credits: {
        enabled: false
      },
      tooltip: {
        pointFormat: '<b>{point.y} Hours</b>'
      },
      yAxis: {
        title: {
          text: 'Hours'
        },
        plotLines: [{
          value: 0,
          width: 1,
          color: '#808080'
        }]
      }
    };
}])
  .controller('NavCtrl', ['$scope', '$document', function($scope, $document) {
    $document.on('scroll', function() {
      $scope.showHeader = ($document.scrollTop() > 100);
      $scope.$apply();
    });
}]);
