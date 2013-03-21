'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('casaApp.services', [])
    .factory('job_data', function () {
	var jobs = [
	    {id: 1, name: 'Job1', client: 'Client1'},
	    {id: 2,name: 'Job2', client: 'Client2'},
	    {id: 3,name: 'Job3', client: 'Client3'},
	    {id: 4,name: 'Job4', client: 'Client4'},
	    {id: 5,name: 'Job5', client: 'Client5'}
	];
	return jobs;
    })
    .factory('employes_data', function () {
	return Element.createFromList("Employee", [
	    {id: 1, name: 'Superviseur1', type: 'Contre-Maître', empClass: 1, state: 1},
	    {id: 2, name: 'Junior1', type: 'Junior', empClass : 4, state: 1},
	    {id: 3, name: 'Senior1', type: 'Senior', empClass : 3, state: 1},
	    {id: 4, name: 'André Leslondes', type: 'Contre-Maître', empClass : 1, state: 1},
	    {id: 5, name: 'Employés 1', type: 'Senior', empClass : 2, state: 1},
	    {id: 6, name: 'Employés 2', type: 'Junior', empClass : 4, state: 1},
	    {id: 7, name: 'Superviseur2', type: 'Contre-Maître', empClass: 1, state: 1},
	    {id: 8, name: 'Jean-Baptiste', type: 'Junior', empClass : 4, state: 1},
	    {id: 9, name: 'Franky', type: 'Senior', empClass : 3, state: 1},
	    {id: 10, name: 'Andréa Leslondes (la jumelle)', type: 'Contre-Maître', empClass : 1, state: 1},
	    {id: 11, name: 'Renaldo', type: 'Senior', empClass : 2, state: 1},
	    {id: 12, name: 'Big Stud', type: 'Junior', empClass : 4, state: 1},
	]);

    })
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

    
