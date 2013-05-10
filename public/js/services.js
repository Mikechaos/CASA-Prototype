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
    .factory('fetch_all', ['$q', 'fetch_data', function ($q, fetch) {
	var deferred = $q.defer();
	$q.all([
	    fetch(new EmployeesType),
	    fetch(new Employee),
	    fetch(new Client),
	    fetch(new Truck),
	    fetch(new Box),
	    fetch({route: '/affectations', strElem: 'Affectation'}),
	    fetch({route: '/deliveries', strElem: 'Affectation'}),
	    fetch(new User),
	    fetch({route: '/settings', strElem: 'null'}),
	]).then(function (array) {
	    App.settings = new Settings(array.pop().fetched[0]);
	    User.createFromList(array.pop().fetched);
	    forEach(array, function (obj) {
		if (obj.strElem !== "Affectation")
		    Element.createFromList(obj.strElem, obj.fetched);
	    });

	    Delivery.createFromList(array.pop().fetched);
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

    
