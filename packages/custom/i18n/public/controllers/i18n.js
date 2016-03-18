'use strict';

/* jshint -W098 */
angular.module('mean.i18n').controller('I18nController', ['$scope', 'Global', 'I18n', '$http',
  function($scope, Global, I18n, $http) {
    $scope.global = Global;
    $scope.package = {
      name: 'i18n'
    };


    $http.get('/api/i18n/example/auth').success(function(user) {
        console.log(">>>> ");
    });

  }
]);
