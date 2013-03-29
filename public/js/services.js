'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('casaApp.services', [])
    .factory('fetch_data', ['$http', function (http) {
	return function (route, make_obj, action) {
	    var array = [];
	    return http({method: 'GET',  url: route, headers: "application/x-www-form-urlencoded"})
		.success(function (data, status) {
		    forEach(data, function (e) {
			array.push(make_obj(e));
		    });
		    action(array);
		})
		.error(function () {
		    console.log('error');
		    // window.location.reload()
		});
	}
    }])
    .factory('fetch_elems', ['$q', '$http', 'fetch_data', function ($q, http, fetch_data) {
	return function (obj, make_obj) {
	    return fetch_data(obj.route, make_obj, function (array) {
		Element.createFromList(obj.strElem, array);
	    });
	}
    }])
    .factory('client_data', ['fetch_elems', function (fetch) {
	return fetch(new Client, function (c) {
	    return {id: c.id, name: c.name, contact: c.contact, ref_number: c.ref_number, city: c.city,
		    address: c.address, phone: c.phone, casa_salesman: c.casa_salesman,
		    state: c.state, notes: c.notes};
	});
    }])
    .factory('job_data', ['$http', 'fetch_elems', function (http, fetch) {
	return fetch(new Job, function (j) {
	    return {id: j.id, name: j.name, client_id: j.client_id, state: j.state, notes: j.notes};
	});
    }])
    .factory('employees_type_data', ['$http', 'fetch_elems', function (http, fetch) {
	
	return [];

	// Element.createFromList("Employee", emps);
	//     {id: 1, name: 'Superviseur1', type: 'Contre-Maître', empClass: 1, state: 1},
	//     {id: 2, name: 'Junior1', type: 'Junior', empClass : 4, state: 1},
	//     {id: 3, name: 'Senior1', type: 'Senior', empClass : 3, state: 1},
	//     {id: 4, name: 'André Leslondes', type: 'Contre-Maître', empClass : 1, state: 1},
	//     {id: 5, name: 'Employés 1', type: 'Senior', empClass : 2, state: 1},
	//     {id: 6, name: 'Employés 2', type: 'Junior', empClass : 4, state: 1},
	//     {id: 7, name: 'Superviseur2', type: 'Contre-Maître', empClass: 1, state: 1},
	//     {id: 8, name: 'Jean-Baptiste', type: 'Junior', empClass : 4, state: 1},
	//     {id: 9, name: 'Franky', type: 'Senior', empClass : 3, state: 1},
	//     {id: 10, name: 'Andréa Leslondes (la jumelle)', type: 'Contre-Maître', empClass : 1, state: 1},
	//     {id: 11, name: 'Renaldo', type: 'Senior', empClass : 2, state: 1},
	//     {id: 12, name: 'Big Stud', type: 'Junior', empClass : 4, state: 1},
	// ]);

    }])
    .factory('employees_data', ['$http', 'fetch_elems', function (http, fetch) {
	return (fetch(new EmployeesType, function (e) {
	    return {id: e.id, type: e.type};
	}).success(function () {
	    fetch(new Employee, function (e) {
		return {id: e.id, name: e.name, employees_type_id: e.employees_type_id, state: e.state, notes: e.notes};
	    });
	}));
    }])
    .factory("truck_data", ['$http', 'fetch_elems', function (http, fetch) {
	return fetch(new Truck, function (e) {
	    return {id: e.id, name: e.name, notes: e.notes, state: e.state};
	});
    }])
    .factory("box_data", ['$http', 'fetch_elems', function (http, fetch) {
	return fetch(new Box, function (e) {
	    return {id: e.id, name: e.name, notes: e.notes, state: e.state};
	});
    }])
    .factory("fetch_all_data", ['$q', 'client_data', 'employees_data', 'truck_data', 'box_data', 'affectation_data', function ($q, clients, employees, trucks, boxes, affectations) {	
	// return clients.success(employees.success(trucks.success(boxes.success(function () {console.log('successfull')})))).error(window.location.href = window.location.href);
	var deferred = $q.defer();
	return clients.success(
	    function () {
		return employees.success(
		    function () {
			return trucks.success(
			    function () {
				return boxes.success(
				    function () {
					setTimeout(function () {
					    return affectations().success(
						function () {
						    console.log(5);
						    console.log('lets load affectations')
						    App.verify_today();
						    deferred.resolve(App);
						    console.log(App);
						}, 3000)
					})
				    })
			    })
		    })
	    })
	    .error();
	//return deferred.promise;
    }])
    .factory("employeesTypes", ['$q', function ($q) {
	var deferred = $q.defer()
	
	return deferred.promise;
    }])
    .factory("user_data", function () {
	return User.createFromList([
	    {id: 1, full_name: "Mike"},
	    {id: 2, full_name: "Christian"},
	
	]);
    })
    .factory("affectation_data", ['fetch_data', function (fetch) {
	return function () { 
	    return fetch('/affectations', function (e) {return e}, function (array) {
	    console.log(array);
	    Affectation.createFromList(array);
	})};
		
		// id: e.id, name: e.name, link_number: e.link_number, client_id: e.client_id, supervisors: e.supervisors,
		//     employees: e.employees, trucks: e.trucks, boxes:, e.boxes, affectation_type: e.affectation_type
		//     notes: e.notes, state: e.state};
    }])
    // .factory("affectation_data", function () {
    // 	var affect_stamp = new Date().setHours(6,0,0);
    // 	var stamp2 = new Date().setHours(10,15,0);
    // 	return Affectation_List.add([
    // 	    { id: 1, job_id: 1, a_timestamp: affect_stamp,
    // 	      supervisors: [{id: 1, start_time : affect_stamp},],
    // 	      employees : [{id: 2, start_time: affect_stamp},
    // 			   {id: 5, start_time: affect_stamp, end_time: new Date().setHours(12,0,0)}],
    // 	      link_number: 10100110101,
    // 	      note: "",
    // 	      user_id : 1
    // 	    },
    // 	    { id: 1, job_id: 1, a_timestamp: stamp2,
    // 	      supervisors: [{id: 1, start_time : stamp2}, {id: 2, start_time: stamp2}],
    // 	      employees : [{id: 2, start_time: stamp2},
    // 			   {id: 5, start_time: stamp2, end_time: new Date().setHours(16,0,0)}],
    // 	      link_number: 10101,
    // 	      note: "",
    // 	      user_id : 2
    // 	    },
	    
    // 	]);
    // })
;

    
