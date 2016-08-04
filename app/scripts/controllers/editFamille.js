'use strict';

/**
 * @ngdoc function
 * @name mmPrestaAdminUiApp.controller:editFamilleCtrl
 * @description
 * # editFamilleCtrl
 * Controller of the mmPrestaAdminUiApp
 */
angular.module('mmPrestaAdminUiApp')
  .controller('editFamilleCtrl', function ($rootScope,$scope,$http,$routeParams) {
    NProgress.start();
    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];

    $scope.familleForm = new Object();

    $scope.newFamilleForm = new Object();

    $scope.param = $routeParams.param;

    $scope.init = function(){
        $("#busyModal").modal("show");
        var url = $rootScope.baseUrl+"/open/famillesPrestation/"+$scope.param+"/action.do";
   	    $http.get(url).success(function(response){
          $scope.famille = response.famille;
          $scope.familleForm = {code: $scope.famille.code,libelle: $scope.famille.libelle};
          $scope.sousFamilles = response.sousFamilles;
          $scope.$apply();
     }).error(function(data,status){
         console.log("ERROR ==="+data+status);
     });
     $("#busyModal").modal("hide");
    }

    $scope.init();




    $scope.editFamilleFormEmpty = function(){
        var code = $scope.familleForm.code;
        var libelle = $scope.familleForm.libelle;
        
        if(code==undefined  || libelle == undefined) return true;
        if(code==null  || libelle == null) return true;
        if($.trim(code)==""  || $.trim(libelle) == "") return true;
        return false;
      }


      $scope.editerFamille = function(){
        $("#busyModal").modal("show");
        var code = $scope.familleForm.code;
        var libelle = $scope.familleForm.libelle;

        var parameter = {
            "id":$scope.famille.id,
            "code":code,
            "libelle":libelle
      }

      console.log(parameter);
      var url = $rootScope.baseUrl+"/regular/famillesPrestation/update.do";
      $http.post(url, parameter).
        success(function(data, status, headers, config) {
        if(status==200){
            $scope.init();
            $scope.$apply();
        }
      }).
      error(function(data, status, headers, config) {
        console.log(status+data.error);
      });

      $("#busyModal").modal("hide");
      }





      $scope.deleteFamille = function (index) {
      $scope.familleToDelete = $scope.sousFamilles[index];
      $("#deleteFamilleModal").modal('show');
    }

    $scope.acceptDeleteFamille = function () {
        $("#deleteFamilleModal").modal('hide');
        $("#busyModal").modal("hide");
      var parameter = {
        "id": $scope.familleToDelete.id
      }

      console.log(parameter);

      var url = $rootScope.baseUrl + "/regular/famillesPrestation/delete.do";
      $http.post(url, parameter).
        success(function (data, status, headers, config) {
            console.log(status);
          if (status == 200) {
            $scope.init();
            $scope.$apply();
          }
        }).
        error(function (data, status, headers, config) {
          console.log(status + data.error);
        });
        $("#busyModal").modal("hide");

      $.snackbar({ content: 'Suppression avec succès' });
    }

    $scope.cancelDeleteFamille = function () {
      $("#deleteFamilleModal").modal('hide');
    }
    
    NProgress.done();
  });