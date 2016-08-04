'use strict';

/**
 * @ngdoc function
 * @name mmPrestaAdminUiApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the mmPrestaAdminUiApp
 */
angular.module('mmPrestaAdminUiApp')
  .controller('MainCtrl', function ($rootScope, $scope, $http) {
    NProgress.start();
    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];

    $scope.familleForm = new Object();

    $scope.init = function () {
      $("#busyModal").modal("show");
      var url = $rootScope.baseUrl + "/open/famillesPrestation/meres/action.do";
      $http.get(url).success(function (response) {
        $scope.famillesMeres = response;
        $scope.$apply();
        console.log(response);
      });
      $("#busyModal").modal("hide");
    }

    $scope.init();




    $scope.checkCodeAvailibility = function () {
      var code = $scope.familleForm.code;
      var result = true;
      if (code == undefined) return false;

      $.each($scope.famillesMeres, function (index, value) {
        if (value.code == code) {
          result = false;
        }
      });
      return result;
    }

    $scope.deleteFamille = function (index) {
      $scope.familleToDelete = $scope.famillesMeres[index];
      $("#deleteFamilleModal").modal('show');
    }

    $scope.acceptDeleteFamille = function () {
      $("#deleteFamilleModal").modal('hide');
      $("#busyModal").modal("show");
      var parameter = {
        "id": $scope.familleToDelete.id
      }

      var url = $rootScope.baseUrl + "/regular/famillesPrestation/delete.do";
      $http.post(url, parameter).
        success(function (data, status, headers, config) {
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



    $scope.createFamille = function () {
      $("#busyModal").modal("show");
      var code = $scope.familleForm.code;
      var libelle = $scope.familleForm.libelle;



      $("#familleCode").val("");
      $("#familleLibelle").val("");

      var parameter = {
        "code": code,
        "libelle": libelle
      }


      if ($scope.familleForm.estFille) {
        var familleMere = $scope.famillesMeres[$scope.familleForm.familleMere];

        parameter = {
          "code": code,
          "libelle": libelle,
          "famillemere": {
            "id": familleMere.id,
            "code": familleMere.code,
            "libelle": familleMere.libelle
          }
        }
      }

      console.log(familleMere + "<==");

      var url = $rootScope.baseUrl + "/regular/famillesPrestation/create.do";
      $http.post(url, parameter).
        success(function (data, status, headers, config) {
          if (status == 200) {
            $scope.init();
            $scope.$apply();
          }
        }).
        error(function (data, status, headers, config) {
          console.log(status + data.error);
        });

      $("#busyModal").modal("hide");
    }

    $scope.newFamilleFormEmpty = function () {
      var code = $scope.familleForm.code;
      var libelle = $scope.familleForm.libelle;

      if (code == undefined || libelle == undefined) return true;
      if (code == null || libelle == null) return true;
      if ($.trim(code) == "" || $.trim(libelle) == "") return true;
      return !$scope.checkCodeAvailibility();
    }


    NProgress.done();
  });
