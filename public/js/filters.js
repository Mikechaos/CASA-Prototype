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
	return function (affectations, supervisor, element, client, link_number) {
	    // (function filter_by_field (array) {
	    if (supervisor !== undefined && supervisor.length !== 0) {
		affectations = affectations.filter(function (a) {
		    return new RegExp('(^|\\s)' + supervisor).test(a.get_supervisor().name);
		});
	    }
	    if (link_number !== undefined && link_number.length !== 0) {
		affectations = affectations.filter(function (a) {
		    return new RegExp('(^|\\s)' + link_number).test(a["link_number"]);
		});
	    }
	    // })(affectations);
	    // (function filter_by_client (array) {
	    if (client !== undefined && client.length !== 0) {
	    	affectations = affectations.filter(function (a) {
	    	    return new RegExp('(^|\\s)' + client).test(a.get_client().name);
	    	});
	    }
	    // })(affectations);
	    // (function filter_by_elems(array) {
	    if (element !== undefined && element.length !== 0) {
	    	affectations = affectations.filter(function (a) {
	    	    return a.elems.is_include(element, function (elem, elem_name) {
	    		return new RegExp('(^|\\s)' + elem_name).test(elem.name);
	    	    });
	    	});
	    }
	    // })(affectations);
	    return affectations;
	}
    })
    .filter('affect_by_elements', function () {
	return function (element) {
	    
	};
    });
