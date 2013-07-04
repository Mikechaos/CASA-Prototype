
'use strict';


// Declare app level module which depends on filters, and services
var casaApp = angular.module('casaApp', ['casaApp.filters', 'casaApp.services', 'casaApp.directives', 'casaApp.controllers',
					 'ui.directives', '$strap.directives', 'ui.bootstrap']).
    config(['$routeProvider', function($routeProvider) {
	$routeProvider.when('/dispatch', {templateUrl: 'partials/dispatch.html', controller: 'DispatchCtrl'})
	    .when('/clients', {templateUrl: 'partials/clients.html', controller: 'AddElems'})
	    .when('/jobs', {templateUrl: 'partials/jobs.html', controller: 'AddElems'})
	    .when('/employees', {templateUrl: 'partials/employees.html', controller: 'AddElems'})
	    .when('/trucks', {templateUrl: 'partials/trucks.html', controller: 'AddElems'})
	    .when('/boxes', {templateUrl: 'partials/boxes.html', controller: 'AddElems'})
	    .when('/utilisateurs', {templateUrl: 'partials/users.html', controller: 'AddElems'})
	    .when('/day_details', {templateUrl: 'partials/day_details.html', controller: 'DayDetailsCtrl'})
	    .when('/login', {templateUrl: 'partials/login.html', controller: 'SessionCtrl'})
	    .when('/settings', {templateUrl: 'partials/settings.html', controller: 'SettingsCtrl'})
	    .when('/vacation', {templateUrl: 'partials/vacation.html', controller: 'VacationCtrl'})
	    // .when('/logout', {templateUrl: 'partials/users.html?page=logout', controller: 'SessionCtrl'})
	    .otherwise({redirectTo: '/dispatch'});

    }]);

