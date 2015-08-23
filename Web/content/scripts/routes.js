(function () {
    "use strict";
    angular.module("twsApp")

    .config(function ($routeProvider) {
        $routeProvider.
            when("/login", {
                templateUrl: "modules/authentication/views/index.html",
                controller: "authenticationController",
                controllerAs: "ctr"
            }).
            when("/home", {
                templateUrl: "modules/home/views/index.html",
                controller: "homeController",
                controllerAs: "ctr"
            }).
            when("/organization", {
                templateUrl: "modules/organization/views/index.html",
                controller: "organizationIndexController",
                controllerAs: "ctr"
            }).
            when("/organization/new", {
                templateUrl: "modules/organization/views/form.html",
                controller: "organizationFormController",
                controllerAs: "ctr"
            }).
            when("/organization/:idOrganization", {
                templateUrl: "modules/organization/views/form.html",
                controller: "organizationFormController",
                controllerAs: "ctr"
            }).
            when("/organization/:idOrganization/serverService/new", {
                templateUrl: "modules/service/views/formServerService.html",
                controller: "serverServiceFormController",
                controllerAs: "ctr"
            }).
            when("/organization/:idOrganization/serverService/:idService", {
                templateUrl: "modules/service/views/formServerService.html",
                controller: "serverServiceFormController",
                controllerAs: "ctr"
            }).
            when("/organization/:idOrganization/clientService/join", {
                templateUrl: "modules/service/views/formClientService.html",
                controller: "clientServiceFormController",
                controllerAs: "ctr"
            }).
            when("/organization/:idOrganization/clientService/:idService", {
                templateUrl: "modules/service/views/formClientService.html",
                controller: "clientServiceFormController",
                controllerAs: "ctr"
            }).
            otherwise({
                redirectTo: "/home"
            }
        );
    });
})();