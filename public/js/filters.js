'use strict';

/* Filters */

angular.module('casaApp.filters', []).
    filter('interpolate', ['version', function(version) {
	return function(text) {
	    return String(text).replace(/\%VERSION\%/mg, version);
	}
    }]).
    filter('cmOnly', function () {
	return function (emps) {
	    var supervisor = [];
	    forEach(emps, function (emp) {
		if (emp.empClass <= 2)
		{
		    supervisor.push(emp);
		}
	    });
	    return supervisor;
	};	
    }).
    filter('subset_emp', function () {
	return function (emps, wantSupervisor) {
	    var filtered_emp = [];
	    forEach(emps, function (emp) {
		var predicate = (wantSupervisor) ? emp.empClass <= 2 : emp.empClass > 2;
		if (predicate)
		{
		    filtered_emp.push(emp);
		}
	    });
	    return filtered_emp;
	};	
    }).
    filter('elemsSeparation', function () {
	return function (elems, obj_class) {
	    var filtered_elems = [];
	    forEach(elems, function (e) {
		if (e.strElem === obj_class)
		{
		    filtered_elems.push(e);
		}
	    });
	    return filtered_elems;
	};	
    }).
    filter('elems', function () {
	return function (elems, strClass) {
	    return elems.filter_elements(strClass);
	};

    }).
    filter('already_attr_elems', function () { // this will most definitly needs some refactoring
	return function (elems, days, date, use_already_affected) {
	    if (use_already_affected) return elems;
	    return App.test(elems, days, date);
	    
	};
    }).
    filter('between', function () {
    	return function (affectations, fst_date, snd_date) {return affectations.filter_affectations(fst_date, snd_date)};
    })
    .filter('affect_by_fields', function () {
	return function (affectations, element, client, link_number) {
	    if ((element === undefined || element.length == 0) &&
		(client === undefined || client.length == 0) &&
		(link_number === undefined || link_number.length == 0)) return affectations;
	    else {
		affectations = new AffectationList(affectations);
		return affectations.filter_by_elem(element).filter_by_client(client).filter_by_field("link_number", link_number).list;
	    }
	};
    })
    .filter('affect_by_elements', function () {
	return function (element) {
	    
	};
    });
