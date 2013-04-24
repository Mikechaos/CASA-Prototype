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
    function DispatchCtrl($scope, $location) {

	$scope.date = {
	    today: new Date(),
	    fstDate: new Date(),
	    // sndDate: 0,
	    sndDate: new Date(),
	}
	// $scope.date.sndDate = new Date($scope.date.today.getFullYear(), $scope.date.today.getMonth(), $scope.date.today.getDate() + 7),

	$scope.affected_elems = App.affected_today;
	$scope.attributed_given_day = App.attributed;
	$scope.affectations = App.affectations;

	$scope.$watch('date.fstDate', function (date) {
	    $scope.$parent.report_date = date;
	});
	
	$scope.dispatch_action = ng.bind(this, this.dispatch_action);
	$scope.quick_view = false;

	$scope.filter = {};

	// hack needed because of the hierarchy of the controllers...
	$scope.today_affect_btn = function () {
	    $scope.newAffectation_date = new Date();
	};
	$scope.$watch('newAffectation_date', function (date) {
	    $scope.$broadcast('set_date', date);
	});
	$scope.$watch('newAffectation_time', function (time, before) {
	    $scope.$broadcast('set_time', time);
	});
		      
	this.scope = $scope;
	return (this);
    };
    
    DispatchCtrl.prototype = {

	dispatch_action: function (affect, action_type) {
	    console.log(affect);
	    this.scope.$broadcast('report_action', affect, action_type);
	},

	request_delete_elem: function (elem) {
	    this.request_affectation();
	},
    };

    function BaseAffectationCtrl($scope, $http) {
	$scope.elems = [];

	// Used to display selected element
	$scope.elements_class = [{name: "Supervisor", screen: "Superviseurs"},
				 {name: "Employee", screen: "Employés"},
				 {name: "Truck", screen: "Camions"},
				 {name: "Box", screen: "Coffres"}];

	// If a new affectation is request, broadcast an event down the children scope to instantiate the right scope with right affect.
	$scope.newAffect = function (type) {
	    var event = (type === 'Delivery') ? 'newDelivery' : 'newAffectation';
	    $scope.$broadcast(event);
	};

	// Used to display right tab (delivery or affectation) when in ADD screen
	$scope.active_screen = {Affectation: "active", Delivery: ""};
    }
    
    BaseAffectationCtrl.prototype = {

	// Used on first init. Binds scope with function needed in interface.
	// Will be call by both children with their own scope so will bind each function with each controller's scope
	// Also inits each screen when data is fetched
	init_first: function ($scope) {
	    
	    this.init_binding($scope);

	    var init = this.init.bind(this);
	    var init_watches = this.init_watches.bind(this);
	    // var set_client = this.add_client.bind(this);
	    $scope.$parent.fetch_all_promise.then(function () {
		init();
		init_watches($scope);
	    });
	},

	scope_binding: function (binding_fns) {
	    
	    this.scope[binding_fns] = ng.bind(this, this[binding_fns]);
	},

	init_binding: function ($scope) {

	    // use nested arrays to implement multiple args
	    // var binding_fns = ['save_affectation', 'clear_all', 'clear_team', //
	    // 		       'post_affectation','cancel_modification',
	    // 		       'clear_team', 'save_modification', 'reset_affectation'];
	    
	    // this.scope_binding(binding_fns);

	    $scope.save_affectation = ng.bind(this, this.save_affectation);
	    $scope.clear_all = ng.bind(this, this.clear_all);
	    $scope.post_affectation = ng.bind(this, this.post_affectation);
	    $scope.clear_team = ng.bind(this, this.clear_team);
	    $scope.cancel_modification = ng.bind(this, this.cancel_modification);
	    $scope.save_modification = ng.bind(this, this.save_modification);
	    $scope.reset_affectation = ng.bind(this, this.reset_affectation);;
	    
	},

	init_watches: function ($scope) {
	    $scope.$on('set_date', function (obj, date) {
		$scope.newAffectation.date = date;
	    });
	    $scope.$on('set_time', function (obj, time) {
		$scope.newAffectation.start_time.time = time;
	    });
	    $scope.$watch('newAffectation.date', this.dateChanged.bind(this));

	    // If we switch to modify, reset everything to avoid collapses.
	    $scope.$watch('$parent.mode', function (after, before) {
		if (before == 'MODIFY') {
		    // console.log('reseting affect', $scope.newAffectation, $scope.before_modif_affect);
		    // console.log($scope.strClass);
		    $scope.reset_affectation();
		    $scope.clear_all();
		}
	    });

	    // If we switch tab, clear everything (safer this way)
	    $scope.$watch('$location.$$url', function (n, o) {
		$scope.clear_all();
	    });

	    // Report hack
	    $scope.$on('report_action', this.dispatch_action.bind(this));
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
	    
	    // hack...
	    this.scope.$parent.$parent.newAffectation_date = this.scope.newAffectation.date;
	    this.scope.$parent.$parent.newAffectation_time = this.scope.newAffectation.start_time.time;
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

	set_affect_screen: function (screen) {
	    for (prop in this.scope.active_screen) { this.scope.active_screen[prop] = ""}
	    this.scope.active_screen[screen] = 'active';
	},

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
		    affect.id = self.post_affectation(affect);
	    	    // App.insert_affect(affect);
	    	}
	    	++i;
	    });
	    App.verify_today();
	    $scope.$parent.$parent.mode = 'ADD';

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
	    this.scope.$parent.$parent.mode = "INDIV";
	    this.clear_all();
	    
	},

	save_modification: function () {
	    this.scope.before_modif_affect.copy(this.scope.newAffectation);
	    this.put_affectation(this.scope.newAffectation);
	    // console.log('Test', this.scope.before_modif_affect);
	    this.scope.$parent.$parent.mode = "INDIV";
	    this.clear_all();
	    this.scope.safeApply();
	},

	init_mod_or_copy_screen: function (affect, copy) {
	    this.clear_all();
	    this.set_affect_screen(affect.strClass);
	    this.scope.$parent.$parent.mode = "MODIFY";
	    (copy === true)
		? this.scope.newAffectation.copy(affect)
		: this.scope.newAffectation = affect;
	    this.scope.elems = this.scope.newAffectation.elems.list;
	    this.select_elem();
	    this.scope.before_modif_affect = new Global[affect.strClass]().copy(this.scope.newAffectation)
	},

	reset_affectation: function () {
	    console.log(this.scope.before_modif_affect);
	    this.scope.newAffectation.clients = [];
	    this.scope.newAffectation.copy(this.scope.before_modif_affect);
	},

	select_elem: function () {
	    this.scope.newAffectation.elems.forEach(function (e) {e.selected = true });
	},

	// Cleans all selected elements
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
	    // console.log(this.scope.keep_team, this.scope.mode, this.scope.newAffectation, this.scope);
	    if (this.scope.keep_team !== true && this.scope.mode !== 'MODIFY') {
		if (affected.is_include(this.scope.newAffectation.get_supervisor()) || this.scope.newAffectation.supervisor_id === undefined ) {
		   this.set_supervisor(affected);
		}
	    }
	},
	
	set_supervisor: function (affected) {
	    this.scope.newAffectation.supervisor_id = App.get_first_not_affected('Supervisor', this.scope.newAffectation.date, affected).id;
	},

	// REPORT ACTIONS
	dispatch_action: function (obj, affect, action_type) {
	    if (affect.strClass === this.scope.strClass) this[action_type](affect);
	},
	
	modify_affect: function (affect) {
	    this.init_mod_or_copy_screen(App.affectations.get_by_id(affect));
	    this.scope.modifying = true;
	},

	copy_affect: function (affect) {
	    this.scope.newAffectation = new Global[affect.strClass];
	    this.init_mod_or_copy_screen(App.affectations.get_by_id(affect), true);
	},

	delete_affect: function (affect) {
	    if (confirm('Êtes-vous certain de vouloir supprimer cette job?')) {
	    	App.affectations.find_and_delete(affect);
	    	this.request_delete_affectation(affect.route + '/' + affect.id);
	    }
	},

	// HTTP ASYNC FUNCTIONS

	request_affectation: function(method, params, route, callback_success, callback_error) {
	    callback_success = callback_success || function () {};
	    callback_error = callback_error || function () {};
	    this.http({method: method,  url: route, params: params, headers: "application/x-www-form-urlencoded"})
		.success(function (data, status) {callback_success(data, status)})
		.error(function () {callback_error()});
	    
	},

	post_affectation: function (a) {
	    this.request_affectation('POST', new Global[a.post_fn](a), a.route, function (data) {
	    	Affectation.createFromList([data]);
	    });
	},

	put_affectation: function(a)
	{
	    this.request_affectation('PUT', new Global[a.post_fn](a), a.route + '/' + a.id)
	},

	request_delete_affectation: function (route_id) {
	    this.request_affectation('DELETE', {}, route_id, function (data) {
		// console.log(data);
	    }, function (data, status) {
		// console.log(data, status);
	    });
	},
    };

    function AffectationCtrl($scope, $http) {
	$scope.strClass = 'Affectation';
	$scope.$parent.dateChanged = ng.bind(this, this.dateChanged);
	$scope.save_affectation = ng.bind(this, this.save_affectation);
	// $scope.$on('newAffectation', this.newAffectation.bind(this));
	this.scope = $scope;
	this.http = $http;
	this.init_first($scope);
    }

    AffectationCtrl.prototype = {
	clear_affectation: function () {
	    this.clear_all();
	},

	newAffectation: function () {
	    this.scope.newAffectation = new Affectation;
	},

	dateChanged: function() {
	    this.check_days.call(this);
	    this.check_supervisor.call(this);
	},

	add_client: function () {
	    this.scope.newAffectation.client_id = App.get_first('Client').id;
	},
    };
    
    function DeliveryCtrl($scope, $http) {
	$scope.strClass = 'Delivery';
	// $scope.post_affectation = ng.bind(this, this.post_affectation);
	$scope.alert_not_functional = {
	    "type": "error",
	    "title": "Pas encore prêt!<br>",
	    "content": "Seule l'interface est actuellement fonctionnelle. Cela vous permet de voir ce que ça aura l'air et de me partager si ça vous convient!",
	};

	$scope.add_client = ng.bind(this, this.add_client);
	$scope.delete_client = ng.bind(this, this.delete_client);

	// $scope.$on('newAffectation', this.clear_delivery.bind(this));
	this.scope = $scope;
	this.init_first($scope);
	this.http = $http
    };

    DeliveryCtrl.prototype = {
	add_client: function () {
	    this.scope.newAffectation.add_client(App.get_first('Client').id);
	},

	delete_client: function (index) {
	    this.scope.newAffectation.delete_client(index);
	},

	set_supervisor: function () {
	    this.scope.newAffectation.supervisor_id = this.scope.newAffectation.get_first_deliverer_not_affected();
	},

	post_affectation: function (a) {
	    this.request_affectation('POST', new PostDelivery(a), '/deliveries', function (data) {
	    	Delivery.createFromList([data]);
	    });
	   //  console.log("posting a delivery");
	},

	// save_affectation: function (clearing_callback) {
	//     console.log('delivery save', this);
	//     this.save_affectation.call(this, clearing_callback); // hack
	// },	

	clear_delivery: function () {
	    this.clear_all();
	},

	newAffectation: function () {
	    // this.clear_all();
	    this.scope.newAffectation = new Delivery;
	    // console.log('$on new Delivery', type);
	},

	dateChanged: function() {
	    this.check_days.call(this);
	    this.check_supervisor.call(this);
	},

    };
    Inherits.multiple([[DeliveryCtrl], [AffectationCtrl]], BaseAffectationCtrl);


    function DateSelecterCtrl($scope) {

	// Date ui
	$scope.today = function () {
	    this.$parent.date.fstDate = new Date();
	}

	$scope.nextWeek = function () {
	    this.date.sndDate = new Date();
	    // this.date.sndDate.setDate(this.date.sndDate.getDate() + 7);
	};

	var single_height = 45;
	var double_height = 45;

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
	.controller('BaseAffectationCtrl', BaseAffectationCtrl)
	.controller('AffectationCtrl', AffectationCtrl)
	.controller('DeliveryCtrl', DeliveryCtrl)
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

