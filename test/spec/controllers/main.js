'use strict';

describe('Controller: MainCtrl', function () {

  // load the controller's module
  beforeEach(module('bulbasaur'));

  var MainCtrl;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller) {
    MainCtrl = $controller('MainCtrl', {
      // place here mocked dependencies
    });
  }));
});
