(function () {
    "use strict";
    angular.module("twsApp")

    .controller("authenticationController", ["$rootScope", "authenticationFactory",
        function ($rootScope, authenticationFactory) {

            var ctr = this;

            ctr.model = {
                email: "",
                password: ""
            };

            ctr.load = function () {

                $rootScope.focus("email");
            };

            ctr.login = function () {

                authenticationFactory.login(ctr.model.email, ctr.model.password)
                    .success(function (response) {
                        authenticationFactory.setCredentials(ctr.model.email, response.access_token);
                        $rootScope.redirectHome();
                    })
                    .catch(function () {
                        toastr.error("Invalid e-mail or password.", "Authentication")
                        $rootScope.focus("email");
                    });
            };
        }
    ]);
})();