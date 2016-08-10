'use strict';

/**
 * @ngdoc function
 * @name mmPrestaAdminUiApp.controller:editFamilleCtrl
 * @description
 * # editFamilleCtrl
 * Controller of the mmPrestaAdminUiApp
 */
angular.module('mmPrestaAdminUiApp')
    .controller('editFamilleCtrl', function ($rootScope, $scope, $http, $routeParams) {
        NProgress.start();
        this.awesomeThings = [
            'HTML5 Boilerplate',
            'AngularJS',
            'Karma'
        ];
        $("#busyModal").modal("show");

        $scope.familleForm = new Object();

        $scope.newFamilleForm = new Object();

        $scope.param = $routeParams.param;

        $scope.init = function () {

            var url = $rootScope.baseUrl + "/open/famillesPrestation/" + $scope.param + "/action.do";
            $http.get(url).success(function (response) {
                $scope.famille = response.famille;
                $scope.familleForm = { code: $scope.famille.code, libelle: $scope.famille.libelle };
                $scope.produitForm = { caracteristiques: new Array() };
                $scope.sousFamilles = response.sousFamilles;
                $scope.$apply();
            }).error(function (data, status) {
                console.log("ERROR ===" + data + status);
            });

            url = $rootScope.baseUrl + "/open/produits/" + $scope.param + "/famille/action.do";
            $http.get(url).success(function (response) {
                $scope.produits = response;
                $scope.$apply();
            }).error(function (data, status) {
                console.log("ERROR ===" + data + status);
            });

            url = $rootScope.baseUrl + "/open/caracteristiquesProduit/action.do";
            $http.get(url).success(function (response) {
                $scope.caracteristiques = response;
                $scope.$apply();
            }).error(function (data, status) {
                console.log("ERROR ===" + data + status);
            });
        }

        $scope.init();

        $("#busyModal").modal("hide");


        $scope.editFamilleFormEmpty = function () {
            var code = $scope.familleForm.code;
            var libelle = $scope.familleForm.libelle;

            if (code == undefined || libelle == undefined) return true;
            if (code == null || libelle == null) return true;
            if ($.trim(code) == "" || $.trim(libelle) == "") return true;
            return false;
        }


        $scope.editerFamille = function () {
            $("#busyModal").modal("show");
            var code = $scope.familleForm.code;
            var libelle = $scope.familleForm.libelle;

            var parameter = {
                "id": $scope.famille.id,
                "code": code,
                "libelle": libelle
            }

            console.log(parameter);
            var url = $rootScope.baseUrl + "/regular/famillesPrestation/update.do";
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




        //DELETE SOUS FAMILLE

        $scope.deleteFamille = function (index) {
            $scope.familleToDelete = $scope.sousFamilles[index];
            $("#deleteFamilleModal").modal('show');
        }

        $scope.acceptDeleteFamille = function () {
            $("#deleteFamilleModal").modal('hide');
            $("#busyModal").modal("show");
            var parameter = {
                "id": $scope.familleToDelete.id
            }

            console.log(parameter);
            var url = $rootScope.baseUrl + "/regular/famillesPrestation/delete.do";
            $http.post(url, parameter).
                success(function (data, status, headers, config) {
                    console.log(status);
                    if (status == 200) {
                        alert("ok");
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



        //ADD produit 
        $scope.addCaracteristique = function () {
            $scope.caracteristiqueToAdd = $scope.caracteristiques[$scope.produitForm.caracteristique];
            $('#addCaracteristiqueModal').modal("show");
        }

        $scope.cancelAddCaracteristique = function () {
            $('#addCaracteristiqueModal').modal("hide");
        }

        $scope.acceptAddCaracteristique = function () {
            var caracteristique = {
                valeurDefaut: $scope.caracteristiqueForm.defaut,
                valeurMin: $scope.caracteristiqueForm.min,
                valeurMax: $scope.caracteristiqueForm.max,
                tarif: $scope.caracteristiqueForm.tarif,
                caracteristiqueProduit: {
                    id: $scope.caracteristiqueToAdd.id,
                    libelle: $scope.caracteristiqueToAdd.libelle
                }

            }

            $scope.caracteristiques.splice($scope.produitForm.caracteristique, 1);
            $scope.produitForm.caracteristiques.push(caracteristique);
            $scope.cancelAddCaracteristique();
        }

        $scope.removeCaracteristique = function ($index) {
            alert($index);
            console.log($scope.produitForm.caracteristiques[$index].caracteristiqueProduit);
            $scope.caracteristiques.push($scope.produitForm.caracteristiques[$index].caracteristiqueProduit);
            console.log("<>>><<" + $scope.caracteristiques);
            $scope.produitForm.caracteristiques.splice($index, 1);
        }



        $scope.produitFormEmpty = function () {
            if ($scope.produitForm == undefined) return true;
            if ($scope.produitForm.libelle == undefined || $scope.produitForm.description == undefined || $scope.produitForm.caracteristiques == undefined) return true;
            if ($scope.produitForm.libelle == null || $scope.produitForm.description == null || $scope.produitForm.caracteristiques == null) return true;
            if ($.trim($scope.produitForm.libelle) == "" || $.trim($scope.produitForm.description) == "" || $scope.produitForm.caracteristiques.length < 1) return true;
            return false;
        }

        $scope.addProduit = function () {
            if ($scope.produitFormEmpty()) return;
            $("#busyModal").modal("show");
            var produit = new Object();

            produit.libelle = $scope.produitForm.libelle;
            produit.description = $scope.produitForm.description;
            produit.listAssociationProduitCaracteristique = $scope.produitForm.caracteristiques;
            produit.famille = $scope.famille;

            var url = $rootScope.baseUrl + "/regular/produits/create.do";
            $http.post(url, JSON.stringify(produit)).
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







        //DELETE PRODUIT

        $scope.deleteProduit = function (index) {
            $scope.produitToDelete = $scope.produits[index];
            $("#deleteProduitModal").modal('show');
        }

        $scope.acceptDeleteProduit = function () {
            $("#deleteProduitModal").modal('hide');
            $("#busyModal").modal("show");
            var parameter = {
                "id": $scope.produitToDelete.id
            }

            console.log(parameter);
            var url = $rootScope.baseUrl + "/regular/produits/delete.do";
            $http.post(url, parameter).
                success(function (data, status, headers, config) {
                    console.log(status);
                    if (status == 200) {
                        $scope.init();
                        $scope.$apply();
                        $.snackbar({ content: 'Suppression avec succès' });

                    }
                }).
                error(function (data, status, headers, config) {
                    $.snackbar({ content: 'Opps! Quelque chose a mal passé' });
                    console.log(status + data.error);
                });
            $("#busyModal").modal("hide");
        }

        $scope.cancelDeleteProduit = function () {
            $("#deleteProduitModal").modal('hide');
        }

        NProgress.done();
    });