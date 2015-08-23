(function () {
    "use strict";
    angular.module("twsApp")
        .controller("clientServiceFormController", [
            "$rootScope", "$routeParams", "serviceFactory",
            function ($rootScope, $routeParams, serviceFactory) {

                var ctr = this;

                ctr.buildedModel = {
                    show: false,
                    content: null
                };

                ctr.model = {
                    service: {
                        id: 0,
                        code: "",
                        name: "",
                        serverUrl: "",
                        serverPort: 0,
                        thriftFile: { content: "" },
                        organization: { id: 0, code: "" }
                    },
                    organization: {
                        id: 0,
                        code: "",
                        name: ""
                    }
                };

                ctr.downloadModel = {
                    languages: [],
                    selectedLanguage: null,
                };

                ctr.searchModel = {
                    code: ""
                };

                ctr.download = function () {

                    var idService = ctr.model.service.id;
                    var idLanguage = ctr.downloadModel.selectedLanguage.id;

                    serviceFactory.download(idService, idLanguage);
                };

                ctr.geLastBuild = function () {

                    var id = ctr.model.service.id;

                    if (id) {
                        serviceFactory.geLastBuild(id,
                            function (response) {
                                if (response.success) {
                                    ctr.buildedModel.show = true;
                                    ctr.buildedModel.isConfirmation = true;
                                    ctr.buildedModel.content = response.content;

                                    if (ctr.buildedModel.content.routes) {
                                        angular.forEach(ctr.buildedModel.content.routes, function (route) {
                                            route.httpMethodSelected = _.find(ctr.buildedModel.httpMethods, { id: route.httpMethod });
                                        });
                                    }
                                }
                            }
                        );
                    }
                };

                ctr.isNew = function () {

                    return $routeParams.idService ? false : true;
                };

                ctr.join = function () {

                    serviceFactory.join(ctr.model.organization.id, ctr.model.service.id,
                        function (response) {
                            if (response.success) {
                                $rootScope.redirectClientServiceById(ctr.model.organization.id, ctr.model.service.id);
                            }
                        }
                    );
                };

                ctr.load = function () {

                    var id = $routeParams.idService;

                    if (id) {
                        serviceFactory.getById(id,
                            function (response) {
                                if (response.success) {
                                    ctr.model.service = response.content;
                                } else if (response.status == 404) {
                                    $rootScope.redirectClientServiceJoin($routeParams.idOrganization)
                                }
                            }
                        );
                    }

                    serviceFactory.getHttpMethods(
                        function (response) {
                            if (response.success) {

                                ctr.buildedModel.httpMethods = response.content;
                            }
                        }
                    );

                    serviceFactory.getLanguages(
                        function (response) {
                            if (response.success) {

                                ctr.downloadModel.languages = response.content;

                                if (response.content && response.content[0]) {
                                    ctr.downloadModel.selectedLanguage = response.content[0];
                                }
                            }
                        }
                    );

                    ctr.model.organization.id = $routeParams.idOrganization;
                };

                ctr.search = function () {

                    ctr.model.service = null;

                    var code = ctr.searchModel.code;

                    if (!code) {
                        toastr.error("Invalid search code.", "Error");
                        return;
                    }

                    serviceFactory.getByCode(code,
                        function (response) {
                            if (response.success) {

                                ctr.model.service = response.content;

                                serviceFactory.joined(ctr.model.organization.id, ctr.model.service.id,
                                    function (otherResponse) {
                                        if (otherResponse.success && otherResponse.content) {
                                            toastr.success("Organization is already joined on this service.");
                                            $rootScope.redirectClientServiceById(ctr.model.organization.id, ctr.model.service.id);
                                        }
                                    }
                                );
                            }
                        }
                    );
                };
            }
        ])
        .controller("serverServiceFormController", [
                "$rootScope", "$routeParams", "serviceFactory",
                function ($rootScope, $routeParams, serviceFactory) {

                    var ctr = this;

                    ctr.buildedModel = {
                        content: null,
                        isConfirmation: false,
                        httpMethods: [],
                        show: false
                    };

                    ctr.downloadModel = {
                        languages: [],
                        selectedLanguage: null,
                    };

                    ctr.model = {
                        id: 0,
                        code: "",
                        name: "",
                        serverUrl: "",
                        serverPort: 0,
                        thriftFile: { content: "" },
                        organization: { id: 0, code: "", name: "" },
                        onEdit: false
                    };

                    ctr.build = function () {

                        var id = ctr.model.id;

                        if (id) {
                            serviceFactory.build(id,
                                function (response) {
                                    if (response.success) {
                                        ctr.buildedModel.show = true;
                                        ctr.buildedModel.isConfirmation = true;
                                        ctr.buildedModel.content = response.content;

                                        if (ctr.buildedModel.content.routes) {
                                            angular.forEach(ctr.buildedModel.content.routes, function (route) {
                                                route.httpMethodSelected = ctr.buildedModel.httpMethods[0];
                                            });
                                        }
                                    }
                                }
                            );
                        }
                    };

                    ctr.confirmBuild = function () {

                        var newRoutes = new Array();

                        if (ctr.buildedModel.content.routes) {
                            angular.forEach(ctr.buildedModel.content.routes, function (route) {

                                var newRoute = {
                                    httpMethod: route.httpMethodSelected.id,
                                    url: route.url
                                };

                                newRoutes.push(newRoute);
                            });
                        }

                        var newModel = {
                            guid: ctr.buildedModel.content.guid,
                            routes: newRoutes
                        };

                        var id = ctr.model.id;

                        if (id) {
                            serviceFactory.confirmBuild(id, newModel,
                                function (response) {
                                    if (response.success) {
                                        ctr.buildedModel.show = false;
                                        ctr.buildedModel.isConfirmation = false;
                                        ctr.buildedModel.content = null;
                                    }
                                }
                            );
                        }
                    };

                    ctr.download = function () {

                        var idService = ctr.model.id;
                        var idLanguage = ctr.downloadModel.selectedLanguage.id;

                        serviceFactory.download(idService, idLanguage);
                    };

                    ctr.edit = function () {

                        ctr.model.onEdit = true;
                        $rootScope.focus("code");
                    };

                    ctr.geLastBuild = function () {

                        var id = ctr.model.id;

                        if (id) {
                            serviceFactory.geLastBuild(id,
                                function (response) {
                                    if (response.success) {
                                        ctr.buildedModel.show = true;
                                        ctr.buildedModel.isConfirmation = false;
                                        ctr.buildedModel.content = response.content;

                                        if (ctr.buildedModel.content.routes) {
                                            angular.forEach(ctr.buildedModel.content.routes, function (route) {
                                                route.httpMethodSelected = _.find(ctr.buildedModel.httpMethods, { id: route.httpMethod });
                                            });
                                        }
                                    }
                                }
                            );
                        }
                    };

                    ctr.isNew = function () {

                        return ctr.model.id ? false : true;
                    };

                    ctr.isNewOrEdit = function () {

                        return ctr.isNew() || ctr.model.onEdit;
                    };

                    ctr.load = function () {

                        var id = $routeParams.idService;

                        if (id) {
                            serviceFactory.getById(id,
                                function (response) {
                                    if (response.success) {
                                        ctr.model = response.content;
                                        ctr.onEdit = false;
                                    }
                                }
                            );
                        }

                        serviceFactory.getHttpMethods(
                            function (response) {
                                if (response.success) {

                                    ctr.buildedModel.httpMethods = response.content;
                                }
                            }
                        );

                        serviceFactory.getLanguages(
                            function (response) {
                                if (response.success) {

                                    ctr.downloadModel.languages = response.content;

                                    if (response.content && response.content[0])
                                        ctr.downloadModel.selectedLanguage = response.content[0];
                                }
                            }
                        );

                        ctr.model.organization.id = $routeParams.idOrganization;
                        $rootScope.focus("code");
                    };

                    ctr.save = function () {

                        var newModel = {
                            id: ctr.model.id,
                            code: ctr.model.code,
                            name: ctr.model.name,
                            serverUrl: ctr.model.serverUrl,
                            serverPort: ctr.model.serverPort,
                            thriftFile: { content: ctr.model.thriftFile.content },
                            organization: { id: ctr.model.organization.id }
                        };

                        serviceFactory.save(newModel,
                            function (response) {
                                if (response.success) {
                                    $rootScope.redirectServerServiceById(response.content.organization.id, response.content.id);
                                    ctr.model.onEdit = false;
                                }
                                else {
                                    $rootScope.focus("code");
                                }
                            }
                        );
                    };
                }
        ])
})();