var app = angular.module('App', []);

app.controller('AppController', function($scope){
//ここでModelとのやりとりなど。
});


'use strict';

angular.module('emojiApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute',
  'ui.bootstrap',
  'emoji'
])
.config(['$routeProvider', function ($routeProvider) {
	$routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  }]);