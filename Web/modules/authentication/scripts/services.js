(function () {
    "use strict";
    angular.module("twsApp")

    .factory("authenticationFactory", ["$rootScope", "$http", "SETTINGS",
        function ($rootScope, $http, SETTINGS) {

            var factory = {};

            factory.login = function (email, password) {

                var data = "grant_type=password&username=" + email + "&password=" + password;
                var header = { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } };
                var relativeUrl = "authentication/token";
                var address = $rootScope.getApiEndpointAddress(relativeUrl);

                return $http.post(address, data, header);
            };

            factory.setCredentials = function (email, token) {

                var user = { email: email };

                sessionStorage.setItem(SETTINGS.AUTH_TOKEN, token);
                sessionStorage.setItem(SETTINGS.AUTH_USER, JSON.stringify(user));

                $rootScope.token = token;
                $rootScope.user = user;
                $rootScope.header = { "Authorization": "Bearer " + token }

                var address = "user";
                var params = { email: email };

                $rootScope.doGet(address, params, function (response) {
                    if (response.success) {
                        $rootScope.user = response.content;
                        sessionStorage.setItem(SETTINGS.AUTH_USER, JSON.stringify(response.content));
                    }
                });
            };

            return factory;
        }
    ]);
})();