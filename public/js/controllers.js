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
	this.scope.fetch_all_promise = fetch_all;
	return (this);
    }
    
    CasaCtrl.prototype = {
	
	// Method definition
	
    };


    // DISPATCH CONTROLLER
    function DispatchCtrl($scope, $http, $location) {

	$scope.elems = [];
	//$scope.jobs = job_data;

	$scope.date = {
	    today: new Date(),
	    fstDate: new Date(),
	    // sndDate: 0,
	    sndDate: new Date(),
	}
	$scope.elements_class = [{name: "Supervisor", screen: "Superviseurs"},
				{name: "Employee", screen: "Employés"},
				{name: "Truck", screen: "Camions"},
				{name: "Box", screen: "Coffres"}];
	// $scope.date.sndDate = new Date($scope.date.today.getFullYear(), $scope.date.today.getMonth(), $scope.date.today.getDate() + 7),
	// $scope.newAffectation = new Affectation();
	$scope.affected_elems = App.affected_today;
	$scope.attributed_given_day = App.attributed;
	// Reset day buttons

	$scope.$watch('date.fstDate', function (date) {
	   $scope.$parent.report_date = date;
	});
	
	$scope.$parent.fetch_all_promise.then(function () {
	    $scope.newAffectation.supervisor_id = App.get_first_not_affected('Supervisor').id;
	    $scope.newAffectation.client_id = App.get_first('Client').id;
	});

	$scope.save_affectation = ng.bind(this, this.save_affectation);
	$scope.clear_all = ng.bind(this, this.clear_all);
	$scope.delete_affectation = ng.bind(this, this.delete_affectation);
	$scope.copy_affectation = ng.bind(this, this.copy_affectation);
	$scope.modify_affectation = ng.bind(this, this.modify_affectation);
	$scope.save_modification = ng.bind(this, this.save_modification);
	$scope.reset_affectation = ng.bind(this, this.reset_affectation);
	$scope.cancel_modification = ng.bind(this, this.cancel_modification);
	$scope.post_affectation = ng.bind(this, this.post_affectation);
	$scope.clear_team = ng.bind(this, this.clear_team);
	$scope.quick_view = false;

	$scope.filter = {};
	
	$scope.$watch('mode', function (after, before) {
	    if (before == 'MODIFY') {
		$scope.reset_affectation();
		$scope.clear_all();
	    }
	});
	
	$scope.newAffect = function (type) {
	    $scope.newAffectation = new Global[type];
	};

	$scope.$watch('$location.$$url', function (n, o) {
	    // console.log(n, o, $location);
	    $scope.clear_all();
	});
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
	this.http = $http
	this.init();
	
	return (this);

    };
    
    DispatchCtrl.prototype = {
	save_affectation: function (clearing_callback) {
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
		    var affect = new Global[$scope.newAffectation.strClass];
		    affect.copy($scope.newAffectation);
	    	    affect.date.setDate($scope.newAffectation.date.getDate() + diff_array[i]);
		    console.log(self.post_affectation);
		    affect.id = self.post_affectation(affect);
	    	    // App.insert_affect(affect);
	    	}
	    	++i;
	    });
	    App.verify_today();

	    this[clearing_callback]();
	    
	},
    	
	clear_keep_team: function () {
	    var supervisor_id = this.scope.newAffectation.supervisor_id
	    var date = this.scope.newAffectation.date;
	    this.scope.keep_team = true;
	    this.init_general();
	    this.scope.newAffectation.date = new Date(date);
	    this.scope.newAffectation.elems.list = [].concat(this.scope.elems)
	    this.scope.newAffectation.supervisor_id = supervisor_id;
	},

	clear_all: function () {
	    this.scope.keep_team = false;
	    this.clean();
	    this.init();
	},
	
	clear_team: function () {
	    this.clean();
	    this.scope.elems = this.scope.newAffectation.elems.list = [];
	},

	cancel_modification: function () {
	    this.reset_affectation();
	    this.scope.mode = "INDIV";
	    this.clear_all();
	    
	},

	reset_affectation: function () {
	    this.scope.newAffectation.copy(this.scope.before_modif_affect);
	},

	save_modification: function () {
	    this.put_affectation(this.scope.newAffectation);
	    this.scope.mode = "INDIV";
	    this.clear_all();
	},

	select_elem: function () {
	    this.scope.newAffectation.elems.forEach(function (e) {e.selected = true });
	},

	init_mod_or_copy_screen: function (affect, copy) {
	    this.clear_all();
	    this.scope.mode = "MODIFY";
	    (copy === true)
		? this.scope.newAffectation.copy(affect)
		: this.scope.newAffectation = affect;
	    this.scope.elems = this.scope.newAffectation.elems.list;
	    this.select_elem();
	    this.scope.before_modif_affect = new Affectation().copy(this.scope.newAffectation)
	},

	modify_affectation: function (id) {
	    this.init_mod_or_copy_screen(App.affectations.get_by_id(id));
	    this.scope.modifying = true;
	},

	copy_affectation: function (id) {
	    this.scope.newAffectation = new Affectation;
	    this.init_mod_or_copy_screen(App.affectations.get_by_id(id), true);
	},

	delete_affectation: function (id) {
	    if (confirm('Êtes-vous certain de vouloir supprimer cette job? ')) {
		App.affectations.find_and_delete(id);
		this.request_delete_affectation(id);
	    }
	},

	request_affectation: function(method, params, route, callback_success, callback_error) {
	    callback_success = callback_success || function () {};
	    callback_error = callback_error || function () {};
	    this.http({method: method,  url: route, params: params, headers: "application/x-www-form-urlencoded"})
		.success(function (data, status) {callback_success(data, status)})
		.error(function () {callback_error()});
	    
	},


	request_delete_elem: function (elem) {
	    this.request_affectation();
	},

	init_general: function () {
	    this.scope.days = {
		Dimanche: false,
		Lundi: false,
		Mardi: false,
		Mercredi: false,
		Jeudi: false,
		Vendredi: false,
		Samedi: false,
	    };
	    this.newAffectation();
	    // var strClass = this.scope.newAffectation.strClass || 'Affectation';
	    // console.log(strClass);
	    // this.scope.newAffectation = new Global[strClass];
	},
	
	newAffectation: function (type) {
	    type = type || 'Affectation';
	    this.scope.newAffectation = new Global[type];
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


	check_days: function () {
	    var $scope = this.scope;
	    forEach(Date.days, function (d) {
		$scope.days[d] = false;
	    });
	    this.scope.days[this.scope.newAffectation.week_day()] = true;
	},

	check_supervisor: function () {
	    var affected = App.verify_day(this.scope.newAffectation.date);
	    // If date changes and we are not just adding new client and we are not modifying/copying existing job
	    // we get first supervisor not affected on day to display in supervisor dropdown
	    console.log(this.scope.keep_team, this.scope.mode, this.scope.newAffectation, this.scope);
	    if (this.scope.keep_team !== true && this.scope.mode !== 'MODIFY') {
		if (affected.is_include(this.scope.newAffectation.get_supervisor()) || this.scope.newAffectation.supervisor_id === undefined ) {
		    this.scope.newAffectation.supervisor_id = App.get_first_not_affected('Supervisor', this.scope.newAffectation.date, affected).id;
		}
	    }
	},

	// dateChanged: function() {
	//     console.log(this);
	//     this.check_days.call(this);
	//     console.log('date change', this.scope.newAffectation.week_day(), this.scope.newAffectation);
	//     this.check_supervisor.call(this);
	// },
	
    };

    function AffectationCtrl($scope, $http) {
	$scope.$parent.dateChanged = ng.bind(this, this.dateChanged);
	console.log($scope.dateChanged);
	$scope.$watch('newAffectation.date', this.dateChanged.bind(this));
	this.scope = $scope;
    }

    AffectationCtrl.prototype = {

	post_affectation: function (a) {
	    this.request_affectation('POST', new PostAffectation(a), '/affectations', function (data) {
	    	Affectation.createFromList([data]);
	    });
	},

	put_affectation: function(a)
	{
	    this.request_affectation('PUT', new PostAffectation(a), '/affectations/' + a.id)
	},

	request_delete_affectation: function (id) {
	    this.request_affectation('DELETE', {}, '/affectations/' + id, function (data) {
		// console.log(data);
	    }, function (data, status) {
		// console.log(data, status);
	    });
	},

	newAffectation: function () {
	    this.scope.newAffectation = new Affectation;
	},

	dateChanged: function() {
	    console.log(this);
	    this.check_days.call(this);
	    console.log('date change', this.scope.newAffectation.week_day(), this.scope.newAffectation);
	    this.check_supervisor.call(this);
	},
    };
    
    function DateSelecterCtrl($scope) {

	// Date ui
	$scope.today = function () {
	    this.date.fstDate = new Date();
	}

	$scope.nextWeek = function () {
	    this.date.sndDate = new Date();
	    // this.date.sndDate.setDate(this.date.sndDate.getDate() + 7);
	};

	var single_height = 45;
	var double_height = 100;

	$scope.mode_enum = {
	    ADD : {name: "ADD", fn: "set_add_mode", height: single_height},
	    MODIFY: {name: "ADD", fn: "set_add_mode", height: single_height},
	    //QUICK : "set_quick_view_mode",
	    SCHEDULE : {name: "SCHEDULE", fn: "set_schedule_mode", height: single_height},
	    INDIV : {name: "INDIV", fn: "set_indiv_mode", height: double_height},
	};
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

    function DeliveryCtrl($scope, $http) {
	$scope.newAffectation = new Delivery;

	// $scope.fetch_all_promise.then(function() {
	//     $scope.newAffectation.add_client(App.get_first('Client').id);
	// });
	$scope.add_client = ng.bind(this, this.add_client);
	// $scope.post_affectation = ng.bind(this, this.post_affectation);
	$scope.save_affectation = ng.bind(this, this.save_affectation);
	console.log($scope.dateChanged);
	$scope.$watch('newAffectation.date', this.dateChanged.bind(this));
	$scope.alert_not_functional = {
	    "type": "error",
	    "title": "Pas encore prêt!<br>",
	    "content": "Seule l'interface est actuellement fonctionnelle. Cela vous permet de voir ce que ça aura l'air et de me partager si ça vous convient!",
	};

	this.scope = $scope;
	this.http = $http
    };

    DeliveryCtrl.prototype = {
	add_client: function () {
	    //this.scope.newAffectation.add_client(App.get_first('Client').id);

	    this.scope.newAffectation.add_client(App.get_first('Client').id);
	    console.log(this.scope);
	},

	post_affectation: function (a) {
	    this.request_affectation('POST', new PostDelivery(a), '/deliveries', function (data) {
	    	Delivery.createFromList([data]);
	    });
	    console.log("posting a delivery");
	},

	save_affectation: function (clearing_callback) {
	    console.log('delivery save', this);
	    this.__proto__.__proto__.save_affectation.call(this, clearing_callback); // hack
	},
	
	newAffectation: function () {
	    this.scope.newAffectation = new Delivery;
	},

	dateChanged: function() {
	    this.check_days.call(this);
	    console.log('date change', this.scope.newAffectation.week_day(), this.scope.newAffectation);
	    this.check_supervisor.call(this);
	},

    };
    Inherits.multiple([[DeliveryCtrl], [AffectationCtrl]], DispatchCtrl);

    DateSelecterCtrl.prototype = { 
	
	set_mode : function (mode, do_not_check_parent) {
	    this.scope.pane_height = mode.height;
	    this[mode.fn]();
	    
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
	this.http = $http
	$scope.submit = ng.bind(this, this.submit($scope, $http));
	$scope.delete_elem = ng.bind(this, this.delete_elem);
	$scope.modify_elem = ng.bind(this, this.modify_elem);
	$scope.submit_modification = ng.bind(this, this.submit_modification);
	$scope.modifying = false;
	$scope.alerts = [];
	this.scope = $scope;
    }

    AddElems.prototype = { 
	submit: function ($scope, $http) {
	    return function () {
		// var save = this.save.bind(this);
		var self = this;

		this.request_elem('POST', $scope.newElem, $scope.newElem.route, function (data) {
		    self.save(data);
		}, function (data, status, headers, config) {
		    $scope.alert.push({
			"type": "error",
			"title": "Erreur lors de l'ajout<br>",
			"content": "Data => " + data + "<br>Status => " + status + "<br>Headers => " + headers + "<br>Config => " + config,
		    });
		});
	    };
	},

	delete_elem: function (elem) {
	    if (!elem.get_deletion_confirmation()) return ;
	    this.request_elem('DELETE', this.scope.newElem, this.scope.newElem.route + '/' + elem.id, function (data) {
		App.elems.find_and_delete(elem);
	    });
	},

	submit_modification: function () {
	    var $scope = this.scope;
	    var self = this;
	    this.request_elem('PUT', this.scope.newElem, this.scope.newElem.route + '/' + this.scope.newElem.id, function () {

		// Swap strElem if can_be_supervisor changed. Not the right place for this. Will use dynamic dispatch
		if ($scope.newElem.supervisor === true) $scope.newElem.strElem = "Supervisor";
		else if ($scope.newElem.strElem === 'Supervisor') $scope.newElem.strElem = "Employee";
		
		$scope.newElem = new Global[$scope.newElem.strElem];
		$scope.modifying = false;
	    });
	},

	modify_elem: function (elem) {
	    window.scrollTo(0,0);
	    this.scope.newElem = elem;
	    this.scope.modifying = true;
	},

	save: function (elem) {
	    Element.createFromList(this.scope.newElem.strElem, [elem]);
	    this.scope.newElem = new Global[this.scope.newElem.strElem];
	},

	request_elem: function(method, params, route, callback_success, callback_error) {
	    callback_success = callback_success || function () {};
	    callback_error = callback_error || function () {};
	    this.http({method: method,  url: route, params: params, headers: "application/x-www-form-urlencoded"})
		.success(function (data, status) {callback_success(data, status)})
		.error(function () {callback_error()});
	},

    };

    function EmployeesCtrl ($scope, $http) {
	AddElems.call(this, $scope, $http);
	$scope.newElem = new Employee;

	$scope.can_be_supervisor = [{value: true, text: "Oui"}, {value:false, text: "Non"}];
	// $scope.watch("newElem.employees_type_id", function(old_val, new_val) (
	//     $scope.safeApply(
	// );

	this.scope = $scope;
    }

    EmployeesCtrl.prototype = {
	save: function (data) {
	    this.scope.newElem.set_string_type();
	    if (this.scope.newElem.supervisor === true) this.scope.newElem.strElem = "Supervisor";
	    else this.scope.newElem.strElem = "Employee";
	    this.constructor.superClass.save.call(this, data);
	},
    };
    

    function EmployeesTypesCtrl ($scope, $http) {
	AddElems.call(this, $scope, $http);
	$scope.newElem = new EmployeesType;
	this.scope = $scope;
    }

    EmployeesTypesCtrl.prototype = {

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
	$scope.$parent.showingDayDetails = true;
	$scope.report_affectations = [];
	$scope.fetched_all.then(function () {
	    $scope.safeApply(function () {
		var date = parseInt(window.location.hash.substr(window.location.hash.search(/\?date=/)+ new String('?date=').length));
		$scope.report_affectations = App.affectations.filter_affectations(new Date(date));
	    });
	});

    };

    
    ng.module('casaApp.controllers', [])
	.controller('CasaCtrl', CasaCtrl)
	.controller('DispatchCtrl', DispatchCtrl)
	.controller('DeliveryCtrl', DeliveryCtrl)
	.controller('AffectationCtrl', AffectationCtrl)
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

