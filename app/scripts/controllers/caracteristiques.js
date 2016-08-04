'use strict';


/**
 * @ngdoc function
 * @name mmPrestaAdminUiApp.controller:CaracteristiquesCtrl
 * @description
 * # CaracteristiquesCtrl
 * Controller of the mmPrestaAdminUiApp
 */
angular.module('mmPrestaAdminUiApp')
    .controller('CaracteristiquesCtrl', function ($rootScope, $scope, $http) {
        NProgress.start();
        $("#busyModal").modal("show");
        /*this.awesomeThings = [
          'HTML5 Boilerplate',
          'AngularJS',
          'Karma'
        ];*/

        $scope.typeForm = new Object();

        $scope.init = function () {

            var url = $rootScope.baseUrl + "/open/caracteristiquesProduit/action.do";
            $http.get(url).success(function (response) {
                $scope.caracteristiques = response;
                $scope.$apply();
            });

            var url = $rootScope.baseUrl + "/open/typesCaracteristiqueProduit/action.do";
            $http.get(url).success(function (response) {
                $scope.types = response;
                $scope.$apply();
            });

        }
        $scope.init();
        $("#busyModal").modal("hide");





        //CREATING Caracteristique
        $scope.caracteristiqueFormEmpty = function () {

            var libelle = $scope.caracteristiqueForm.libelle;
            var description = $scope.caracteristiqueForm.description;
            var type = $scope.caracteristiqueForm.type;

            if (libelle == undefined || description == undefined || type==undefined) return true;
            if (libelle == null || description==null || type==null) return true;
            if ($.trim(libelle) == "" || $.trim(description) == "") return true;
            return false;
        }

        $scope.createCaracteristique = function () {
            $("#busyModal").modal("show");
            var libelle = $scope.caracteristiqueForm.libelle;
            var description = $scope.caracteristiqueForm.description;
            var typeId = $scope.caracteristiqueForm.type;


            $("#caracteristiqueLibelle").val("");
            $("#caracteristiqueDescription").val("");

            var parameter = {
                "libelle": libelle,
                "description":description,
                "type":{
                    "id":typeId
                }
            }

            var url = $rootScope.baseUrl + "/regular/caracteristiquesProduit/create.do";
            $http.post(url, parameter).
                success(function (data, status, headers, config) {
                    if (status == 200) {
                        $.snackbar({ content: "succès!"});
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
            $scope.caracteristiqueToEdit = $scope.caracteristiques[index];
            $("#editCaracteristiqueModal").modal('show');
        }

        $scope.caracteristiqueEditFormEmpty = function () {
            var libelle = $scope.caracteristiqueEditForm.libelle;
            var description = $scope.caracteristiqueEditForm.description;
            var type = $scope.caracteristiqueEditForm.type;
            
            if (libelle == undefined || description == undefined || type==undefined) return true;
            if (libelle == null || description==null || type==null) return true;
            if ($.trim(libelle) == "" || $.trim(description) == "") return true;
            return false;
        }

        $scope.editCaracteristique = function () {
            var message= "Opps! Quelque chose a mal passé";
            $("#editCaracteristiqueModal").modal("hide");
            $("#busyModal").modal("show");
            var libelle = $scope.caracteristiqueEditForm.libelle;
            var description = $scope.caracteristiqueEditForm.description;
            var typeId = $scope.caracteristiqueEditForm.type;

            var parameter = {
                "id":$scope.caracteristiqueToEdit.id,
                "libelle": libelle,
                "description":description,
                "type":{
                    "id":typeId
                }
            }

            var url = $rootScope.baseUrl + "/regular/caracteristiquesProduit/edit.do";
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

        $scope.cancelCaracteristiqueEdit = function () {
            $("#editCaracteristiqueModal").modal('hide');
        }


        //DELETING TYPE
        $scope.deleteCaracteristique = function (index) {
            $scope.caracteristiqueToDelete = $scope.caracteristiques[index];
            $("#deleteCaracteristiqueModal").modal('show');
        }

        $scope.acceptDeleteCaracteristique = function () {
            var message= "Opps! Quelque chose a mal passé";
            $("#deleteCaracteristiqueModal").modal('hide');
            $("#busyModal").modal("show");
            var parameter = {
                "id": $scope.caracteristiqueToDelete.id
            }

            var url = $rootScope.baseUrl + "/regular/caracteristiquesProduit/delete.do";
            $http.post(url, parameter).
                success(function (data, status, headers, config) {
                    if (status == 200) {
                        $.snackbar({ content: "succès!"});
                        $scope.init();
                        $scope.$apply();
                        message = "Suppression avec succès";
                    }
                }).
                error(function (data, status, headers, config) {
                    console.log(status + data.error);
                    $.snackbar({ content: message});
                });

            $("#busyModal").modal("hide");

            

        }

        $scope.cancelDeleteCaracteristique = function () {
            $("#deleteCaracteristiqueModal").modal('hide');
        }
    });