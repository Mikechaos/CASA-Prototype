'use strict';

/* Controllers */


(function (ng, app, $http, client_data, job_data, employes_data, truck_data, box_data) {

    // CASA CONTROLLER
    function CasaCtrl($scope)
    {
	this.scope = $scope;
	
	this.scope.root = '/#/';
	return (this);
	
    }
    
    CasaCtrl.prototype = {
	
	// Method definition
	
    };


    // DISPATCH CONTROLLER
    // Will need to refactor usage of services here
    function DispatchCtrl($scope, client_data, job_data, employes_data, truck_data, box_data) {

	$scope.elems = [];
	$scope.jobs = job_data;

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
	$scope.elements = App.elems;
	$scope.newAffectation = new Affectation();
	$scope.save_affectation = ng.bind(this, this.save_affectation);
	$scope.affected_elems = App.affected_today
	$scope.attributed_given_day = App.attributed;
	$scope.$watch('newAffectation.date', function () {
	    forEach(Date.days, function (d) {
		$scope.days[d] = false;
	    });
	    $scope.days[$scope.newAffectation.week_day()] = true;
	    App.verify_day($scope.newAffectation.date);
	    
	});
	
	$scope.clear_affectation = ng.bind(this, this.clear_affectation);
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
	    forEach (Date.days, function (d, i) {
	    	if ($scope.days[d] === true) {
		    var affect = new Affectation();
		    affect.copy($scope.newAffectation);
	    	    affect.date.setDate($scope.newAffectation.date.getDate() + diff_array[i]);
	    	    App.insert_affect(affect);
	    	}
	    	++i;
	    });
	    this.clean();
	    this.init();
	},
    	
	init: function () {
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
	    this.scope.elems = [];
	    this.scope.$watch('newAffectation', this.scope.newAffectation.render());
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

	// adm_ prefix => add mode
	this.addm_height = 45;

	// selectm_ => select mode
	this.selectm_height = 100;

	// Date ui
	$scope.today = function () {
	    this.date.fstDate = new Date();
	}

	$scope.nextWeek = function () {
	    this.date.sndDate = new Date();
	    this.date.sndDate.setDate(this.date.sndDate.getDate() + 7);
	};
	$scope.mode_enum = {
	    ADD : "add_mode",
	    SELECT : "select_mode",
	};

	$scope.set_mode = ng.bind( this, this.set_mode );

	this.scope = $scope;
	this.set_select_mode();
	// this.set_add_mode();


	return (this);

    };

    DateSelecterCtrl.prototype = { 
	
	set_mode : function (mode) {
	    (mode === this.scope.mode_enum.ADD) ? this.set_add_mode() : this.set_select_mode();
	},
	
	set_add_mode : function () { 
	    this.scope.pane_height = this.addm_height;
	    this.scope.$parent.affectation = true;
	},

	set_select_mode : function () {
	    this.scope.pane_height = this.selectm_height;
	    this.scope.$parent.affectation = false;
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
		$http({method: 'POST',  url: this.scope.newElem.route, params: this.scope.newElem, headers: "application/x-www-form-urlencoded"});
		// success(function (data, status) {console.log(data)}).
		// error(function () {console.log('error')});
	    }
	},

    };

    function EmployeesCtrl ($scope, $http) {
	AddElems.call(this, $scope, $http);
	$scope.newElem = new Employee;

	$scope.employeeTypes = [
	    {name: "Superviseur", id: 0},
	    {name: "Senior", id: 1},
	    {name: "Junior", id: 2},
	];

	this.scope = $scope;
    }

    EmployeesCtrl.prototype = {
    };

    function JobsCtrl ($scope, $http, client_data, job_data) {
	AddElems.call(this, $scope, $http);
	$scope.newElem = new Job;
	$scope.clients = App.elems.filter_elements("Client");
	console.log(this);
    }

    JobsCtrl.prototype = {};
			  
			   
    function ClientsCtrl ($scope, $http) {
	AddElems.call(this, $scope, $http);
	$scope.newElem = new Client;
    }

    Inherits.multiple([[EmployeesCtrl], [JobsCtrl], [ClientsCtrl]], AddElems);

    ng.module('casaApp.controllers', [])
	.controller('CasaCtrl', CasaCtrl)
	.controller('DispatchCtrl', DispatchCtrl)
	.controller('ElementsSelectionCtrl', ElementsSelectionCtrl)
	.controller('DateSelecterCtrl', DateSelecterCtrl)
	.controller('RenderCtrl', RenderCtrl)
	.controller('AddElems', AddElems)
	.controller('ClientsCtrl', ClientsCtrl)
	.controller('JobsCtrl', JobsCtrl)
	.controller('EmployeesCtrl', EmployeesCtrl)
	.controller('UsersCtrl', function(){});
    
}(angular, casaApp));

