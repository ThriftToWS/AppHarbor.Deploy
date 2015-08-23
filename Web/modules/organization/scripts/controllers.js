(function () {
    "use strict";
    angular.module("twsApp")

    .controller("organizationIndexController", ["$rootScope", "organizationFactory",
        function ($rootScope, organizationFactory) {

            var ctr = this;

            ctr.model = {
                itens: []
            };

            ctr.load = function () {

                var id = $rootScope.user.id;

                organizationFactory.getByUser(id,
                    function (response) {
                        if (response.success) {
                            ctr.model.itens = response.content;
                        }
                    }
                );
            };
        }
    ])

    .controller("organizationFormController", ["$rootScope", "$routeParams", "organizationFactory",
        function ($rootScope, $routeParams, organizationFactory) {

            var ctr = this;

            ctr.model = {
                id: 0,
                code: "",
                name: "",
                onEdit: false
            };

            ctr.edit = function () {

                ctr.model.onEdit = true;
                $rootScope.focus("code");
            };

            ctr.load = function () {

                var id = $routeParams.idOrganization;

                if (id) {
                    organizationFactory.getById(id,
                        function (response) {
                            if (response.success) {
                                ctr.model = response.content;
                                ctr.onEdit = false;
                            }
                        }
                    );
                }

                $rootScope.focus("code");
            };

            ctr.isNew = function () {

                return ctr.model.id ? false : true;
            };

            ctr.isNewOrEdit = function () {

                return ctr.isNew() || ctr.model.onEdit;
            };

            ctr.save = function () {

                var newModel = {
                    id: ctr.model.id,
                    code: ctr.model.code,
                    name: ctr.model.name
                }

                organizationFactory.save(newModel,
                    function (response) {
                        if (response.success) {
                            $rootScope.redirectOrganizationById(response.content.id);
                            ctr.model.onEdit = false;
                        }
                        else {
                            $rootScope.focus("code");
                        }
                    }
                );
            };
        }
    ]);
})();