'use strict';

/**
 * @ngdoc overview
 * @name mmPrestaAdminUiApp
 * @description
 * # mmPrestaAdminUiApp
 *
 * Main module of the application.
 */
angular
  .module('mmPrestaAdminUiApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        controllerAs: 'main'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl',
        controllerAs: 'about'
      })
      .otherwise({
        redirectTo: '/'
      });
  }).run(function($rootScope){
        $rootScope.baseUrl="http://localhost:8888/services";
    
}).controller("loginCtrl",function($rootScope,$scope,$http){
    $scope.submit = function(){

      var username = $scope.userForm.username;
      var password = $scope.userForm.password;

      var parameter = {
            "username":username,
            "password":password
      }

      var url = $rootScope.baseUrl+"/open/utilisateurs/login.do";
    $http.post(url, parameter).
    success(function(data, status, headers, config) {

        if(status==200){
            sessionStorage.setItem("mm-presta-auth-token",data);
            $("#myModal").modal('hide');
        }
        
        if(status==401){
          $scope.loginForm.error="Login ou mot de passe invalide";
        }
      }).
      error(function(data, status, headers, config) {
        // called asynchronously if an error occurs
        // or server returns response with an error status.
        console.log(status);
      });

    }

    $scope.formControl = function(){
      
      var username = $scope.userForm.username;
      var password = $scope.userForm.password;

      if(username==undefined  || password == undefined) return true;
      if(username==null  || password == null) return true;
      if($.trim(username)==""  || $.trim(password) == "") return true;

      console.log($.trim(username) + $.trim(password));

      return false;
    }
  });

 $(function() {
    $.material.init();
});