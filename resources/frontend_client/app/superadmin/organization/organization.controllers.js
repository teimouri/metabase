'use strict';
/*global _*/

var OrganizationControllers = angular.module('superadmin.organization.controllers', [
    'corvus.services',
    'metabase.forms'
]);

OrganizationControllers.controller('OrganizationListController', ['$scope', 'Organization',
    function($scope, Organization) {

        $scope.deleteOrganization = function(organization) {
            Organization.delete({
                orgId: organization.id
            }, function() {
                $scope.organizations = _.filter($scope.organizations, function(org) {
                    return org.id !== organization.id;
                });
            }, function(err) {
                console.log("Error deleting Org:", err);
            });
        };

        $scope.organizations = [];

        // initialize on load
        Organization.list(function(orgs) {
            $scope.organizations = orgs;
        }, function(error) {
            console.log("Error getting organizations: ", error);
        });
    }
]);

OrganizationControllers.controller('OrganizationDetailController', ['$scope', '$routeParams', '$location', 'Organization', 'MetabaseForm',
    function($scope, $routeParams, $location, Organization, MetabaseForm) {

        $scope.organization = undefined;

        // initialize on load
        if ($routeParams.orgId) {
            // editing an existing organization
            Organization.get({
                'orgId': $routeParams.orgId
            }, function (org) {
                $scope.organization = org;
            }, function (error) {
                console.log("Error getting organization: ", error);
                // TODO - should be a 404 response
            });

            // provide a relevant save() function
            $scope.save = function(organization) {
                MetabaseForm.clearFormErrors($scope.form);
                Organization.update(organization, function (org) {
                    $scope.organization = org;
                    $scope.form.successMessage = "Successfully saved!";
                }, function (error) {
                    MetabaseForm.parseFormErrors($scope.form, error);
                });
            };

        } else {
            // assume we are creating a new org
            $scope.organization = {};

            // provide a relevant save() function
            $scope.save = function(organization) {
                MetabaseForm.clearFormErrors($scope.form);
                Organization.create(organization, function (org) {
                    $scope.form.successMessage = "Successfully saved!";
                    $location.path('/superadmin/organization/' + org.id);
                }, function (error) {
                    MetabaseForm.parseFormErrors($scope.form, error);
                });
            };
        }

        // always get our form input
        Organization.form_input(function (result) {
            $scope.form_input = result;
        }, function (error) {
            console.log('error getting form input', error);
        });
    }
]);
