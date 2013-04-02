'use strict';

/* Directives */


angular.module('casaApp.directives', []).
    directive('header', function factory() {
	return {
	    replace: true,
	    transclude: false,
	    restrict: 'C',
	    scope: false,
	    templateUrl: 'partials/_header.html',
	};
    })
    .directive('renderAffectation', function() {
	return {
	    require: 'ngModel',
	    templateUrl: 'partials/render_affectation.html',
	    link: function(scope, element, attrs, controller) {
		scope.affect = scope[attrs.ngModel];
		//TODO: implementation logic will have to be written here
	    }
	};
    });

// .directive('paneElem' function factory() {

    // 	return function (

    // };// .
    // directive('header', function factory() {
    // 	return {
    // 	    replace: true,
    // 	    transclude: false,
    // 	    restrict: 'C',
    // 	    scope: false,
    // 	    template: '<select ng-model="emp"  ng-options="emp.name for emp in emps"></select>',
    // 	};
    // });
