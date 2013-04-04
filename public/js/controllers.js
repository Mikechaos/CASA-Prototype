'use strict';

/* Controllers */


(function (ng, app, $http, fetch_all) {

    // CASA CONTROLLER
    function CasaCtrl($scope, fetch_all)
    {
	$scope.elements = App.elems;
	this.scope = $scope;
	

	$scope.safeApply = function(fn) {
	    var phase = this.$root.$$phase;
	    if(phase == '$apply' || phase == '$digest') {
		if(fn && (typeof(fn) === 'function')) {
		    fn();
		}
	    } else {
		this.$apply(fn);
	    }
	};
	this.scope.root = '/#/';
	this.scope.fetched_all = fetch_all;
	this.scope.showingDayDetails = false;
	// this.scope.data_promise = fetch_all_data;
	// console.log(this.scope.data_promise);
	// fetch_all_data.then(function () { console.log("hmm"); affectation_data().success(function () {console.log('wooh!')})});

	this.scope.report_date = new Date;

	return (this);
    }
    
    CasaCtrl.prototype = {
	
	// Method definition
	
    };


    // DISPATCH CONTROLLER
    function DispatchCtrl($scope, $http) {

	$scope.elems = [];
	//$scope.jobs = job_data;

	$scope.date = {
	    today: new Date(),
	    fstDate: new Date(),
	    sndDate: 0,
	}
	$scope.elements_class = [{name: "Supervisor", screen: "Superviseurs"},
				{name: "Employee", screen: "Employés"},
				{name: "Truck", screen: "Camions"},
				{name: "Box", screen: "Coffres"}];
	$scope.date.sndDate = new Date($scope.date.today.getFullYear(), $scope.date.today.getMonth(), $scope.date.today.getDate() + 7),
	$scope.newAffectation = new Affectation();
	$scope.affected_elems = App.affected_today
	$scope.attributed_given_day = App.attributed;

	// Reset day buttons
	$scope.$watch('newAffectation.date', function () {
	    forEach(Date.days, function (d) {
		$scope.days[d] = false;
	    });
	    $scope.days[$scope.newAffectation.week_day()] = true;
	    App.verify_day($scope.newAffectation.date);
	    
	});

	$scope.$watch('date.fstDate', function (date) {
	   $scope.$parent.report_date = date;
	});
	
	$scope.save_affectation = ng.bind(this, this.save_affectation);
	$scope.clear_affectation = ng.bind(this, this.clear_affectation);
	$scope.delete_affectation = ng.bind(this, this.delete_affectation);
	$scope.copy_affectation = ng.bind(this, this.copy_affectation);
	$scope.modify_affectation = ng.bind(this, this.modify_affectation);
	$scope.save_modification = ng.bind(this, this.save_modification);

	$scope.quick_view = false;

	$scope.filter = {};

	/*
	$scope.validation_error = false;
	$scope.alert: {	
	    "type": "error",
	    "title": "Erreur de validation!",
	    "content": "Dans l'état actuel des choses, vous essayez d'attribuer des employés déjà attribués à cette affectaction. Essayez de déselectionner certaines journées"
	};
	$scope.$watch('days', function () {
	    
	};*/
	this.scope = $scope;
	this.http = $http;
	this.init();
	
	return (this);

    };
    
    DispatchCtrl.prototype = {
	save_affectation: function () {
	    // Copy affectation over other date selected
	    //this.scope.days[this.scope.newAffectation.week_day()] = false;
	    var diff = -(Date.days.indexOf(this.scope.newAffectation.week_day()));
	    var diff_array = [];
	    for (var i = 0; i < 7; ++i) {
		diff_array[i] = diff + i;
	    }

	    var $scope = this.scope
	    var self = this;
	    forEach (Date.days, function (d, i) {
	    	if ($scope.days[d] === true) {
		    var affect = new Affectation();
		    affect.copy($scope.newAffectation);
	    	    affect.date.setDate($scope.newAffectation.date.getDate() + diff_array[i]);
		    affect.id = self.post_affectation(affect);
	    	    App.insert_affect(affect);
	    	}
	    	++i;
	    });
	    var supervisor_id = this.scope.newAffectation.supervisor_id
	    App.verify_today();
	    // If we just save the affect, means we keep the same team
	    this.init_general();
	    this.scope.newAffectation.elems.list = [].concat(this.scope.elems)
	    this.scope.newAffectation.supervisor_id = supervisor_id;
	},
    	
	save_modification: function () {
	    this.put_affectation(this.scope.newAffectation)
	    this.scope.mode = "INDIV";
	    this.clean();
	    this.init();
	},

	select_elem: function () {
	    this.scope.newAffectation.elems.forEach(function (e) {e.selected = true });
	},

	init_mod_or_copy_screen: function (affect, copy) {
	    this.clean();
	    this.init();
	    this.scope.mode = "ADD";
	    (copy === true)
		? this.scope.newAffectation.copy(affect)
		: this.scope.newAffectation = affect;
	    this.scope.elems = this.scope.newAffectation.elems.list;
	    this.select_elem();
	},

	modify_affectation: function (id) {
	    this.scope.modifying = true;
	    this.init_mod_or_copy_screen(App.affectations.get_by_id(id));
	},

	copy_affectation: function (id) {
	    this.scope.newAffectation = new Affectation;
	    this.init_mod_or_copy_screen(App.affectations.get_by_id(id), true);
	},

	delete_affectation: function (id) {
	    this.scope.mode = "ADD";
	},
	
	request_affectation: function(method, params, route, callback_success, callback_error) {
	    callback_success = callback_success || function () {};
	    callback_error = callback_error || function () {};
	    this.http({method: method,  url: route, params: params, headers: "application/x-www-form-urlencoded"})
		.success(function (data, status) {callback_success()})
		.error(function () {callback_error()});
	    
	},

	post_affectation: function (a) {
	    this.request_affectation('POST', new PostAffectation(a), '/affectations');
	},

	put_affectation: function(a)
	{
	    this.request_affectation('PUT', new PostAffectation(a), '/affectations/' + a.id);
	},

	init_general: function () {
	    this.scope.newAffectation = new Affectation();
	    this.scope.days = {
		Dimanche: false,
		Lundi: false,
		Mardi: false,
		Mercredi: false,
		Jeudi: false,
		Vendredi: false,
		Samedi: false,
	    };
	},

	init: function () {
	    this.init_general();
	    
	    // If I want to prevent editing team once confirmed
	    // Set those to false
	    this.scope.team_confirmed = true;
	    this.scope.team_applied = true;
	    this.scope.use_already_affected = false;
	    this.scope.elems = [];
	    //this.scope.$watch('newAffectation', this.scope.newAffectation.render());
	    this.scope.modifying = false;
	},

	clean: function () {
	    forEach(this.scope.elements.list, function(e, i) {
		e.selected = false;
	    });
	},

	clear_affectation: function () {
	    this.clean();
	    this.init();
	},
    };

    
    function DateSelecterCtrl($scope) {

	// Date ui
	$scope.today = function () {
	    this.date.fstDate = new Date();
	}

	$scope.nextWeek = function () {
	    this.date.sndDate = new Date();
	    this.date.sndDate.setDate(this.date.sndDate.getDate() + 7);
	};

	var single_height = 45;
	var double_height = 100;

	$scope.mode_enum = {
	    ADD : {name: "ADD", fn: "set_add_mode", height: single_height},
	    //QUICK : "set_quick_view_mode",
	    SCHEDULE : {name: "SCHEDULE", fn: "set_schedule_mode", height: single_height},
	    INDIV : {name: "INDIV", fn: "set_indiv_mode", height: double_height},
	};
	console.log($scope.mode_enum);
	$scope.set_mode = ng.bind( this, this.set_mode );

	var set_mode = this.set_mode.bind(this);
	$scope.$watch('$parent.mode', function (mode) {
	    set_mode($scope.mode_enum[mode], false);
	});

	this.scope = $scope;
	this.set_mode($scope.mode_enum.SCHEDULE);
	// this.set_add_mode();


	return (this);

    };

    DateSelecterCtrl.prototype = { 
	
	set_mode : function (mode, do_not_check_parent) {
	    this.scope.pane_height = mode.height;
	    this[mode.fn]();
	    
	    console.log(do_not_check_parent);
	    if (do_not_check_parent !== false) this.scope.$parent.mode = mode.name;
	},
	
	set_add_mode : function () { 

	    this.scope.$parent.affectation = true;
	},
	set_view_mode: function (schedule_view) {
	    this.scope.$parent.affectation = false;
	    this.scope.$parent.schedule_view = schedule_view;
	},

	set_schedule_mode : function () {
	    this.set_view_mode(true);
	},

	set_indiv_mode : function () {
	    this.set_view_mode(false);
	},

    };
    
    function ElementsSelectionCtrl($scope) {

	$scope.opts = {
	    backdropFade: true,
	    dialogFade:true
	};

	$scope.open  = ng.bind(this, this.open);
	$scope.close = ng.bind(this, this.close);
	$scope.change = ng.bind(this, this.change);
	$scope.process = ng.bind(this, this.process);
	// Hack. Needed because of the way I create the DOM with ng-repeat
	$scope.hack = [{active: "active"}, {active: ""}, {active: ""}, {active: ""}];
	$scope.ids = ["supervisor", "employee", "truck", "box"];
	
	this.scope = $scope;
	return this;

    }

    ElementsSelectionCtrl.prototype = {

	change: function (e) {
	    e.selected === true ? this.add(e) : this.delete(e);
	},
	
	add: function (e) {
	    this.scope.elems.push(e); 
	},
	
	delete: function (e) {
	    this.scope.elems.splice(search_index(this.scope.elems, e), 1);
	},
	
	process: function () {
	    this.scope.newAffectation.elems.list = [].concat(this.scope.elems)
	    this.scope.$parent.team_applied = true;
	},
	
	open: function () {
	    this.scope.shouldBeOpen = true;
	},

	close: function () {
	    this.scope.shouldBeOpen = false;
	},

    };

    function RenderCtrl($scope) {
	$scope.affectations = App.affectations;
	
    }

    function AddElems ($scope, $http) {

	//console.log($http.post('/nimporrteou', 'test'));
	$scope.submit = ng.bind(this, this.submit($scope, $http));
	this.scope = $scope;
    }

    AddElems.prototype = { 
	submit: function ($scope, $http) {
	    return function () {
		var self = this;
		$http({method: 'POST',  url: this.scope.newElem.route, params: this.scope.newElem, headers: "application/x-www-form-urlencoded"})
		    .success(function (data, status) {self.save();})
		    .error(function () {console.log('error')});
	    }
	},

	save: function () {
	    App.elems.push(this.scope.newElem);
	    this.scope.newElem = new Global[this.scope.newElem.strElem];
	    // console.log("superClass called");
	},

    };

    function EmployeesCtrl ($scope, $http) {
	AddElems.call(this, $scope, $http);
	$scope.newElem = new Employee;
	$scope.employeesTypes = {};
	// $scope.employeesTypes
	$scope.fetched_all.then(function () {
	    $scope.employeesTypes = App.elems.filter_elements("EmployeesType");
	    $scope.safeApply();	    
	});

	$scope.refresh_employees = function () {
	    $scope.employeesTypes = App.elems.filter_elements("EmployeesType");
	    $scope.safeApply();
	};

	this.scope = $scope;
    }

    EmployeesCtrl.prototype = {
	save: function () {
	    this.scope.newElem.set_string_type();
	    App.elems.push(this.scope.newElem.employees_type_id === 0 ? new Supervisor(this.scope.newElem) : this.scope.newElem);
	    this.scope.newElem = new Employee;
	},
	// submit: function () {
	//     this.superClass.submit.call(this)
	//     this.scope.newElem = new Employee;
	// },
    };
    

    function EmployeesTypesCtrl ($scope, $http) {
	AddElems.call(this, $scope, $http);
	$scope.newElem = new EmployeesType;
	this.scope = $scope;
    }

    EmployeesTypesCtrl.prototype = {
	save: function () {
	    this.constructor.superClass.save.call(this);
	    this.scope.refresh_employees();
	}
    };

    function JobsCtrl ($scope, $http) {
	AddElems.call(this, $scope, $http);
	$scope.newElem = new Job;
	$scope.clients = App.elems.filter_elements("Client");
    }

    JobsCtrl.prototype = {

    };
	
				   
    function ClientsCtrl ($scope, $http) {
	AddElems.call(this, $scope, $http);
	$scope.newElem = new Client;
    }
    
    ClientsCtrl.prototype = {
 
    };

    function TrucksCtrl ($scope, $http) {
	AddElems.call(this, $scope, $http);
	$scope.newElem = new Truck;
    }

    TrucksCtrl.prototype = {

    };
	
    function BoxesCtrl ($scope, $http) {
	AddElems.call(this, $scope, $http);
	$scope.newElem = new Box;
    }

    BoxesCtrl.prototype = {

    };

    Inherits.multiple([[EmployeesCtrl], [EmployeesTypesCtrl], [JobsCtrl], [ClientsCtrl], [TrucksCtrl], [BoxesCtrl]], AddElems);

    function DayDetailsCtrl ($scope) {
	console.log('triggered');
	$scope.$parent.showingDayDetails = true;
	$scope.report_affectations = [];
	$scope.fetched_all.then(function () {
	    $scope.safeApply(function () {
		var date = parseInt(window.location.hash.substr(window.location.hash.search(/\?date=/)+ new String('?date=').length));
		console.log(new Date(date));
		console.log(parseInt(date));
		$scope.report_affectations = App.affectations.filter_affectations(new Date(date));
		console.log($scope.report_affectations);
	    });
	});

    };

    
    ng.module('casaApp.controllers', [])
	.controller('CasaCtrl', CasaCtrl)
	.controller('DispatchCtrl', DispatchCtrl)
	.controller('ElementsSelectionCtrl', ElementsSelectionCtrl)
	.controller('DateSelecterCtrl', DateSelecterCtrl)
	.controller('RenderCtrl', RenderCtrl)
	.controller('AddElems', AddElems)
	.controller('ClientsCtrl', ClientsCtrl)
	.controller('JobsCtrl', JobsCtrl)
	.controller('TrucksCtrl', TrucksCtrl)
	.controller('BoxesCtrl', BoxesCtrl)
	.controller('EmployeesCtrl', EmployeesCtrl)
	.controller('EmployeesTypesCtrl', EmployeesTypesCtrl)
	.controller('UsersCtrl', function(){})
	.controller('DayDetailsCtrl', DayDetailsCtrl);
    
}(angular, casaApp));

