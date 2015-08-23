(function () {
    "use strict";
    angular.module("twsApp")

    .factory("homeFactory", ["$rootScope", "$http", "SETTINGS",
        function ($rootScope, $http, SETTINGS) {

            var factory = {};

            return factory;
        }
    ]);
})();