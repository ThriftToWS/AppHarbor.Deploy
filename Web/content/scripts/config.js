(function () {
    "use strict";
    angular.module("twsApp")

    .constant("SETTINGS", {
        "API_BASE_URL": "/api",
        "AUTH_TOKEN": "twsToken",
        "AUTH_USER": "twsUser",
        "ENVIRONMENT": "dev",
        "VERSION": "0.0.1",
    })

    .run(function ($rootScope, $location, $cookieStore, $http, $window, $timeout, SETTINGS) {

        $rootScope.apiBaseUrl = SETTINGS.API_BASE_URL;
        $rootScope.dataLoading = false;
        $rootScope.header = null;
        $rootScope.token = null;
        $rootScope.user = null;

        var token = sessionStorage.getItem(SETTINGS.AUTH_TOKEN);
        var user = JSON.parse(sessionStorage.getItem(SETTINGS.AUTH_USER));

        if (user && token) {
            $rootScope.header = { "Authorization": "Bearer " + token };
            $rootScope.token = token;
            $rootScope.user = user;
        }

        $rootScope.clearCredentials = function () {

            $rootScope.token = null;
            $rootScope.user = null;
            sessionStorage.setItem(SETTINGS.AUTH_TOKEN, null);
            sessionStorage.setItem(SETTINGS.AUTH_USER, null);
        };

        $rootScope.doGet = function (relativeUrl, params, callback) {

            $rootScope.dataLoading = true;

            var address = $rootScope.getApiEndpointAddress(relativeUrl);

            $http({
                url: address,
                method: "GET",
                params: params,
                headers: $rootScope.header
            })
            .success(function (response) {
                $rootScope.dataLoading = false;
                callback(response);
            })
            .error(function (response) {
                $rootScope.dataLoading = false;
                toastr.error(response.content, "Error");
                callback(response);
            });
        };

        $rootScope.doPost = function (relativeUrl, data, callback, successMessage) {

            $rootScope.dataLoading = true;

            var address = $rootScope.getApiEndpointAddress(relativeUrl);

            $http({
                url: address,
                method: "POST",
                data: JSON.stringify(data),
                headers: $rootScope.header
            })
            .success(function (response) {
                $rootScope.dataLoading = false;

                if (successMessage)
                    toastr.success(successMessage, "Success");

                callback(response);
            })
            .error(function (response) {
                $rootScope.dataLoading = false;

                if (response.status == 500)
                    toastr.error("Couldn't process your request.", "Error");
                else
                    toastr.error(response.content, "Error");

                callback(response);
            });
        };

        $rootScope.focus = function (id) {

            var element = $window.document.getElementById(id);

            if (element) {
                $timeout(function () { element.focus(); }, 1);
            }
        };

        $rootScope.getApiEndpointAddress = function (endpoint) {

            return $rootScope.apiBaseUrl + "/" + endpoint;
        };

        $rootScope.redirectLogin = function () {
            $location.path("/login");
        };

        $rootScope.redirectHome = function () {
            $location.path("/home");
        };

        $rootScope.redirectOrganizationById = function (id) {
            $location.path("/organization/" + id);
        };

        $rootScope.redirectOrganizationIndex = function () {
            $location.path("/organization");
        };

        $rootScope.redirectOrganizationNew = function () {
            $location.path("/organization/new");
        };

        $rootScope.redirectClientServiceById = function (idOrganization, idService) {
            $location.path("/organization/" + idOrganization + "/clientService/" + idService);
        };

        $rootScope.redirectClientServiceJoin = function (idOrganization) {
            $location.path("/organization/" + idOrganization + "/clientService/join");
        };

        $rootScope.redirectServerServiceById = function (idOrganization, idService) {
            $location.path("/organization/" + idOrganization + "/serverService/" + idService);
        };

        $rootScope.redirectServerServiceNew = function (idOrganization) {
            $location.path("/organization/" + idOrganization + "/serverService/new");
        };

        $rootScope.$on("$locationChangeStart", function (event, next, current) {

            if (!$rootScope.user || !$rootScope.token) {
                $rootScope.redirectLogin();
            }
            else if ($location.path() == "/login") {
                $rootScope.redirectHome();
            }
            else if ($location.path() == "/logout") {
                $rootScope.clearCredentials();
                $rootScope.redirectLogin();
            }
        });
    });
})();