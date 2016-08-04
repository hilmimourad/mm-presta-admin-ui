'use strict';


/**
 * @ngdoc function
 * @name mmPrestaAdminUiApp.controller:TypesCtrl
 * @description
 * # TypesCtrl
 * Controller of the mmPrestaAdminUiApp
 */
angular.module('mmPrestaAdminUiApp')
    .controller('TypesCtrl', function ($rootScope, $scope, $http) {
        NProgress.start();
        $("#busyModal").modal("show");
        /*this.awesomeThings = [
          'HTML5 Boilerplate',
          'AngularJS',
          'Karma'
        ];*/

        $scope.typeForm = new Object();

        $scope.init = function () {

            var url = $rootScope.baseUrl + "/open/typesCaracteristiqueProduit/action.do";
            $http.get(url).success(function (response) {
                $scope.types = response;
                $scope.$apply();
            });

        }
        $scope.init();
        $("#busyModal").modal("hide");






        //CREATING TYPE
        $scope.checkLibelleAvailablity = function () {
            var libelle = $scope.typeForm.libelle;
            var result = true;
            if (libelle == undefined) return false;

            $.each($scope.types, function (index, value) {
                if (value.libelle == libelle) {
                    result = false;
                }
            });
            return result;
        }

        $scope.typeFormEmpty = function () {

            var libelle = $scope.typeForm.libelle;

            if (libelle == undefined) return true;
            if (libelle == null) return true;
            if ($.trim(libelle) == "") return true;
            return !$scope.checkLibelleAvailablity();
        }

        $scope.createType = function () {
            $("#busyModal").modal("show");
            var libelle = $scope.typeForm.libelle;

            $("#typeLibelle").val("");

            var parameter = {
                "libelle": libelle
            }

            var url = $rootScope.baseUrl + "/regular/typesCaracteristiqueProduit/create.do";
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

        //EDITING TYPE
        $scope.startEditing = function(index){
            $scope.typeToEdit = $scope.types[index];
            $("#editTypeModal").modal('show');
        }

        $scope.checkLibelleAvailablityEditing = function () {
            var id = $scope.typeToEdit;
            var libelle = $scope.typeEditForm.libelle;
            var result = true;
            if (libelle == undefined) return false;

            $.each($scope.types, function (index, value) {
                if (value.libelle == libelle && value.id != id) {
                    result = false;
                }
            });
            return result;
        }

        $scope.typeEditFormEmpty = function () {
            var libelle = $scope.typeEditForm.libelle;
            if (libelle == undefined) return true;
            if (libelle == null) return true;
            if ($.trim(libelle) == "") return true;
            return !$scope.checkLibelleAvailablityEditing();
        }

        $scope.editType = function () {
            var message= "Opps! Quelque chose a mal passé";
            $("#editTypeModal").modal("hide");
            $("#busyModal").modal("show");
            var libelle = $scope.typeEditForm.libelle;

            var parameter = {
                "id":$scope.typeToEdit.id,
                "libelle": libelle
            }

            var url = $rootScope.baseUrl + "/regular/typesCaracteristiqueProduit/edit.do";
            $http.post(url, parameter).
                success(function (data, status, headers, config) {
                    if (status == 200 || status=="200") {
                        $.snackbar({ content: "succès!"});
                        $scope.init();
                        $scope.$apply();
                        
                    }else $.snackbar({ content: message});
                }).
                error(function (data, status, headers, config) {
                    console.log(status + data.error);
                    $.snackbar({ content: message});
                });
            $("#busyModal").modal("hide");
            
        }

        $scope.cancelTypeEdit = function () {
            $("#editTypeModal").modal('hide');
        }


        //DELETING TYPE
        $scope.deleteType = function (index) {
            $scope.typeToDelete = $scope.types[index];
            $("#deleteTypeModal").modal('show');
        }

        $scope.acceptDeleteType = function () {
            var message= "Opps! Quelque chose a mal passé";
            $("#deleteTypeModal").modal('hide');
            $("#busyModal").modal("show");
            var parameter = {
                "id": $scope.typeToDelete.id
            }

            var url = $rootScope.baseUrl + "/regular/typesCaracteristiqueProduit/delete.do";
            $http.post(url, parameter).
                success(function (data, status, headers, config) {
                    if (status == 200) {
                        $scope.init();
                        $scope.$apply();
                        message = "Suppression avec succès";
                    }
                }).
                error(function (data, status, headers, config) {
                    console.log(status + data.error);
                });

            $("#busyModal").modal("hide");

            $.snackbar({ content: message});

        }

        $scope.cancelDeleteType = function () {
            $("#deleteTypeModal").modal('hide');
        }
    });