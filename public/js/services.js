'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('casaApp.services', [])
    .factory('fetch_data', ['$http', function (http) {
	return function (obj, make_obj) {
	    var array = [];
	    return http({method: 'GET',  url: obj.route, headers: "application/x-www-form-urlencoded"})
		.success(function (data, status) {
		    forEach(data, function (e) {
			array.push(make_obj(e));
		    });
		    Element.createFromList(obj.strElem, array);
		});
	}
    }])
    .factory('client_data', function () {
	return Element.createFromList("Client", [
	    {id: 1, name: 'Client1', notes:''},
	    {id: 2, name: 'Client2', notes:''},
	    {id: 3, name: 'Client3', notes:''},
	    {id: 4, name: 'Client4', notes:''},
	    {id: 5, name: 'Client5', notes:''}
	]);
    })
    .factory('job_data', ['$http', 'fetch_data', function (http, fetch) {
	fetch(new Job, function (j) {
	    return {id: j.id, name: j.name, client_id: j.client_id, state: j.state, notes: j.notes};
	});
	return [];
    }])
    .factory('employees_data', ['$http', 'fetch_data', function (http, fetch) {
	fetch(new Employee, function (e) {
	    return {id: e.id, name: e.name, employees_type_id: e.employees_type_id, state: e.state, notes: e.notes};
	});
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
    .factory('employees_type_data', ['$http', 'fetch_data', function (http, fetch) {
	return fetch(new EmployeesType, function (e) {
	    return {id: e.id, type: e.type};
	});
    }])
    .factory("truck_data", ['$http', 'fetch_data', function (http, fetch) {
	return fetch(new Truck, function (e) {
	    return {id: e.id, name: e.name, notes: e.notes, state: e.state};
	});
    }])
    .factory("box_data", ['$http', 'fetch_data', function (http, fetch) {
	return fetch(new Box, function (e) {
	    return {id: e.id, name: e.name, notes: e.notes, state: e.state};
	});
    }])
    .factory("user_data", function () {
	return User.createFromList([
	    {id: 1, full_name: "Mike"},
	    {id: 2, full_name: "Christian"},
	
	]);
    })
    .factory("affectation_data", function () {
	var affect_stamp = new Date().setHours(6,0,0);
	var stamp2 = new Date().setHours(10,15,0);
	return Affectation_List.add([
	    { id: 1, job_id: 1, a_timestamp: affect_stamp,
	      supervisors: [{id: 1, start_time : affect_stamp},],
	      employees : [{id: 2, start_time: affect_stamp},
			   {id: 5, start_time: affect_stamp, end_time: new Date().setHours(12,0,0)}],
	      link_number: 10100110101,
	      note: "",
	      user_id : 1
	    },
	    { id: 1, job_id: 1, a_timestamp: stamp2,
	      supervisors: [{id: 1, start_time : stamp2}, {id: 2, start_time: stamp2}],
	      employees : [{id: 2, start_time: stamp2},
			   {id: 5, start_time: stamp2, end_time: new Date().setHours(16,0,0)}],
	      link_number: 10101,
	      note: "",
	      user_id : 2
	    },
	    
	]);
    });

    
