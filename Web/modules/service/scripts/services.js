(function () {
    "use strict";
    angular.module("twsApp")

    .factory("serviceFactory", ["$rootScope", "$http",
        function ($rootScope, $http) {

            var factory = {};

            factory.build = function (id, callback) {
                var address = "build/" + id;
                var data = null;
                $rootScope.doPost(address, data, callback);
            };

            factory.confirmBuild = function (id, confirmationModel, callback) {
                var address = "build/" + id + "/confirm";
                var data = confirmationModel;
                $rootScope.doPost(address, data, callback, "Build succeeded.");
            };

            factory.download = function (idService, idLanguage) {
                var address = $rootScope.getApiEndpointAddress("download/" + idService + "?language=" + idLanguage);
                window.open(address, "_blank");
            };

            factory.getByCode = function (code, callback) {
                var address = "service";
                var params = { code: code };
                $rootScope.doGet(address, params, callback);
            };

            factory.getById = function (id, callback) {
                var address = "service/" + id;
                var params = null;
                $rootScope.doGet(address, params, callback);
            };

            factory.getHttpMethods = function (callback) {
                var address = "httpmethod";
                var params = null;
                $rootScope.doGet(address, params, callback);
            };

            factory.getLanguages = function (callback) {
                var address = "language";
                var params = null;
                $rootScope.doGet(address, params, callback);
            };

            factory.geLastBuild = function (id, callback) {
                var address = "build/" + id + "/last";
                var params = null;
                $rootScope.doGet(address, params, callback);
            };

            factory.join = function(idOrganization, idService, callback) {
                var address = "organization/" + idOrganization + "/join/" + idService;
                var data = null;
                $rootScope.doPost(address, data, callback, "Joined on service.");
            };

            factory.joined = function (idOrganization, idService, callback) {
                var address = "organization/" + idOrganization + "/joined/" + idService;
                var params = null;
                $rootScope.doGet(address, params, callback);
            };

            factory.save = function (service, callback) {
                var address = "service";
                var data = service;
                $rootScope.doPost(address, data, callback, "Service saved.");
            };
            
            return factory;
        }
    ]);
})();