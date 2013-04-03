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
	    templateUrl: 'partials/render_schedule.html',
	    compile: function(element, attrs) {
		return function postLink(scope, element, attrs, controller) {
		    scope.affect = scope[attrs.ngModel];

		    // TODO remove this setTimeout
		    setTimeout(function () {
			element.find('td#emp0').attr('style', 'border-top:3px solid #dddddd;');
			element.find('td#truck0').attr('style', 'border-top:3px solid #dddddd;');
			element.find('td#box0').attr('style', 'border-top:3px solid #dddddd;');
		    }, 1000);
		};
	    },

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
