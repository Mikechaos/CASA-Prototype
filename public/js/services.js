'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('casaApp.services', [])
    .factory('client_data', function () {
	return Element.createFromList("Client", [
	    {id: 1, name: 'Client1', notes:''},
	    {id: 2, name: 'Client2', notes:''},
	    {id: 3, name: 'Client3', notes:''},
	    {id: 4, name: 'Client4', notes:''},
	    {id: 5, name: 'Client5', notes:''}
	]);
    })
    .factory('job_data', function () {
	return Element.createFromList("Job", [
	    {id: 1, name: 'Job1', client_id: 1, notes:'I\'m job number 1'},
	    {id: 2, name: 'Job2', client_id: 2, notes:'Ironically, I\'m job number 2'},
	    {id: 3, name: 'Job3', client_id: 3, notes:'Me three'},
	    {id: 4, name: 'Job4', client_id: 4, notes:'You four. Meh. You, me. Life is so dramatic'},
	    {id: 5, name: 'Job5', client_id: 5, notes:'RAINBOW 5'}
	]);
    })
    .factory('employes_data', ['$http', function (http) {
	var emps = [];
	http({method: 'GET',  url: '/employees', headers: "application/x-www-form-urlencoded"})
	    .success(function (employees, status) {
		console.log(employees);
		forEach(employees, function (e) {
		    emps.push({id: e.id, name: e.name, employees_type_id: e.employees_type_id, state: e.state, notes: e.notes});
		});
		emps = Element.createFromList("Employee", emps);
		console.log(emps);
	    });
	return emps;
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
    })
    .factory("truck_data", function () {
	return Element.createFromList("Truck", [
	    {id: 1, name: 'Truck1',},
	    {id: 2, name: 'Ram 2450',},
	    {id: 3, name: 'FORD F-150'},
	    {id: 4, name: 'Oméga 2',},
	    {id: 5, name: 'Titruck',},
	    {id: 6, name: 'Monster edge'},
	    {id: 7, name: 'Truck2', },
	]);
    })
    .factory("box_data", function () {
	return Element.createFromList("Box", [
	    {id: 1, name: 'Coffre1',},
	    {id: 2, name: 'Coffre2',},
	    {id: 3, name: 'Coffre3',},
	    {id: 4, name: 'Coffre4',},
	    {id: 5, name: 'Coffre5',},
	    {id: 6, name: 'Coffre6',},
	    {id: 7, name: 'Coffre7',},
	]);
    });

    
