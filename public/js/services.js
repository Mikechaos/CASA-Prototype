'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('casaApp.services', [])
    .factory('fetch_data', ['$q', '$http', function ($q, http) {
	return function (obj) {
	    var array = [];
	    var deferred = $q.defer();
	    http({method: 'GET',  url: obj.route, headers: "application/x-www-form-urlencoded"})
		.success(function (data, status) {
		    forEach(data, function (e) {
			array.push(e);
		    });
		    deferred.resolve({strElem: obj.strElem, fetched: array});
		})
		.error(function () {
		    console.log('error');
		    window.location.reload()
		});
	    return deferred.promise;
	}
    }])
    .factory('fetch_all', ['$q', 'fetch_elems', 'fetch_data', function ($q, fetch, fetch_data) {
	var deferred = $q.defer();
	$q.all([
	    fetch_data(new EmployeesType),
	    fetch_data(new Employee),
	    fetch_data(new Client),
	    fetch_data(new Truck),
	    fetch_data(new Box),
	    fetch_data({route: '/affectations', strElem: 'Affectation'}),
	]).then(function (array) {
	    forEach(array, function (obj) {
		if (obj.strElem !== "Affectation")
		    Element.createFromList(obj.strElem, obj.fetched);
	    });
	    Affectation.createFromList(array.pop().fetched);
	    deferred.resolve();
	    
	});
	return deferred.promise;
    }])
    .factory("user_data", function () {
	return User.createFromList([
	    {id: 1, full_name: "Mike"},
	    {id: 2, full_name: "Christian"},
	
	]);
    });

    
