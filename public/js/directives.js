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
    });// .directive('paneElem' function factory() {
	
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
