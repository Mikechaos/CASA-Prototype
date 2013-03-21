'use strict';


// Declare app level module which depends on filters, and services
var casaApp = angular.module('casaApp', ['casaApp.filters', 'casaApp.services', 'casaApp.directives', 'casaApp.controllers',
					 'ui.directives', '$strap.directives', 'ui.bootstrap']).
    config(['$routeProvider', function($routeProvider) {
	$routeProvider.when('/dispatch', {templateUrl: 'partials/dispatch.html', controller: 'DispatchCtrl'})
	    .when('/jobs', {templateUrl: 'partials/jobs.html', controller: 'JobsCtrl'})
	    .when('/employes', {templateUrl: 'partials/employes.html', controller: 'EmployesCtrl'})
	    .when('/utilisateurs', {templateUrl: 'partials/user.html', controller: 'UsersCtrl'})
	    .otherwise({redirectTo: '/dispatch'});

    }]);

