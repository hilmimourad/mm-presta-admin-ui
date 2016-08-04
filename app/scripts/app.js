'use strict';

/**
 * @ngdoc overview
 * @name mmPrestaAdminUiApp
 * @description
 * # mmPrestaAdminUiApp
 *
 * Main module of the application.
 */
var module = angular.module('mmPrestaAdminUiApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch'
  ]);

  module.config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        controllerAs: 'main'
      })
      .when('/famille/:param/edit', {
        templateUrl: 'views/editFamille.html',
        controller: 'editFamilleCtrl',
        controllerAs: 'editFamille'
      }).when('/types', {
        templateUrl: 'views/types.html',
        controller: 'TypesCtrl',
        controllerAs: 'types'
      })
      .when('/caracteristiques', {
        templateUrl: 'views/caracteristiques.html',
        controller: 'CaracteristiquesCtrl',
        controllerAs: 'caracteristiques'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl',
        controllerAs: 'about'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
  
  
  module.run(function($rootScope){
        NProgress.configure({ showSpinner: false });
        $rootScope.tokenName="mm-presta-auth-token";
        if(sessionStorage.getItem($rootScope.tokenName)==null){
            $("#myModal").modal('show');
        }
        else $("#myModal").modal('hide');  
        $rootScope.baseUrl="http://localhost:8888/services"; 

        var options =  {
          content: "Some text", // text of the snackbar
          style: "toast", // add a custom class to your snackbar
          timeout: 100 // time in milliseconds after the snackbar autohides, 0 is disabled
        }
          $.snackbar(options);

          
});

module.controller("contentCtrl",function($rootScope,$scope){

    $scope.notSignedIn = function(){
      if(sessionStorage.getItem($rootScope.tokenName)==null){
        return true;
      }
      return false;
    }
});



module.controller("loginCtrl",function($rootScope,$scope,$http){

    $scope.userForm = new Object();

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
            sessionStorage.setItem($rootScope.tokenName,data);
            $scope.username=username;
            $("#myModal").modal('hide');

            $.snackbar({content:'Bonjour '+$scope.username});
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
      return false;
    }
  });
  




  module.controller("logoutController",function($rootScope,$scope){

    $scope.logout = function(){
        sessionStorage.removeItem($rootScope.tokenName);
        $("#myModal").modal('show');
    }

  });

 $(function() {
    $.material.init();
    var options =  {
    content: "Some text", // text of the snackbar
    style: "toast", // add a custom class to your snackbar
    timeout: 100 // time in milliseconds after the snackbar autohides, 0 is disabled
}
  $.snackbar(options);

});