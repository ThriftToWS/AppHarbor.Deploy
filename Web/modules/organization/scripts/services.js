(function () {
    "use strict";
    angular.module("twsApp")

    .factory("organizationFactory", ["$rootScope", "$http",
        function ($rootScope, $http) {

            var factory = {};

            factory.getById = function (id, callback) {
                var address = "organization/" + id;
                var params = null;
                $rootScope.doGet(address, params, callback);
            };

            factory.getByUser = function (id, callback) {
                var address = "user/" + id + "/organizations";
                var params = null;
                $rootScope.doGet(address, params, callback);
            };

            factory.save = function (organization, callback) {
                var address = "organization";
                var data = organization;
                $rootScope.doPost(address, data, callback, "Organization saved.");
            };

            return factory;
        }
    ]);
})();