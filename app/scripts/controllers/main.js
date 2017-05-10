'use strict';
angular.module('bulbasaur').controller('MainCtrl', ['$scope', '$http', 'moment', function($scope, $http, moment) {
  $scope.age = _.floor(moment.duration(moment().diff(moment('07-18-1988', 'MM-DD-YYYY'))).asYears());
  $scope.empty = true;
  $scope.skillSelect = 'last30days';
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
    $scope.projects = _.reject(data.data.projects, ['status', false]);
    var isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    $scope.likes = _.chunk(data.data.likes, ((isMobile) ? 2 : 3));
    _.forEach($scope.projects, function(project, key) {
      $scope.projects[key].description_modified = _.join(project.description, '<br /><br />');
    });
  });

  function getCustomDate(range) {
    return (range === 'customrange' && $scope.date.startdate && $scope.date.enddate) ? '&start=' + $scope.date.startdate + '&end=' + $scope.date.enddate : '';
  }
  $scope.getSkills = function(range) {
    $scope.empty = false;
    $http.get('https://wartortle.herokuapp.com?range=' + range + getCustomDate(range)).then(function(data) {
      if (data.status === 200) {
        var languages = data.data.Languages;
        var editors = data.data.Editors;
        var timeline = data.data.Timeline;
        var total_count = _.reduce(languages, function(sum, n) {
          return sum + n.total_seconds;
        }, 0);
        _.forEach(languages, function(value, index) {
          languages[index].y = _.ceil((value.total_seconds / total_count) * 100, 2);
        });
        _.forEach(editors, function(value, index) {
          editors[index].y = _.ceil((value.total_seconds / total_count) * 100, 2);
        });
        $scope.chartLanguageConfig.series = [{
          data: languages
        }];
        $scope.chartEditorConfig.series = [{
          data: editors
        }];
        $scope.chartDateConfig.series = [{
          showInLegend: false,
          data: _.map(timeline, 'total_seconds').map(function(v) {
            return v / 3600;
          })
        }];
        $scope.chartDateConfig.xAxis = {
          categories: _.map(timeline, 'date').map(function(v) {
            return moment(v).format('MMM Do');
          })
        };
        if (_.isEmpty(languages) || _.isEmpty(editors) || _.isEmpty(timeline)) {
          $scope.empty = true;
        }
      }
    });
    if (range === 'customrange') {
      $('#customRangeModal').modal('hide');
    }
  };
  $scope.datePicker = {
    date: {
      startDate: null,
      endDate: null
    }
  };
  $scope.getSkills($scope.skillSelect);
  $scope.date = {};
  $scope.skillChange = function() {
    if ($scope.skillSelect !== 'customrange') {
      $scope.getSkills($scope.skillSelect);
    } else {
      $('#customRangeModal').modal('show');
      $('#customRangeModal').on('shown.bs.modal', function() {
        $('.nav-tabs .active + li a').removeProp('data-toggle');
        $('#datetimepicker1, #datetimepicker2').datetimepicker({
          inline: true,
          useCurrent: false,
          format: 'L',
          maxDate: moment().add(1, 'days'),
          minDate: moment('2016-06-22', 'YYYY-MM-DD')
        }).end().on('dp.change', function(e) {
          if (e.target.id === 'datetimepicker1') {
            $scope.date.startdate = moment(e.date).format('MMM Do YYYY');
            $('.nav-tabs > .active + li a').trigger('click');
            $('#datetimepicker2').data('DateTimePicker').minDate(moment(e.date));
          } else {
            $scope.date.enddate = moment(e.date).format('MMM Do YYYY');
          }
          $scope.$apply();
        });
      });
    }
  };
  $scope.chartLanguageConfig = {
    chart: {
      type: 'pie',
      width: $('.skills .col-md-6').width()
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
      type: 'pie',
      width: $('.skills .col-md-6').width()
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
      width: $('.skills .col-md-12').width()
    },
    title: {
      text: 'Coding Activity'
    },
    credits: {
      enabled: false
    },
    tooltip: {
      pointFormatter: function() {
        var time = this.y * 3600,
          hrs = _.floor(time / 3600),
          mins = _.floor((time % 3600) / 60);
        return ((hrs > 0) ? hrs + ' Hours ' : '') + ((mins > 0) ? mins + ' Mins' : '');
      }
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
}]).controller('NavCtrl', ['$scope', '$document', function($scope, $document) {
  $document.on('scroll', function() {
    $scope.showHeader = ($document.scrollTop() > 100);
    $scope.$apply();
  });
}]);
