// casaApp.factory('models', function() {

// === MODELS === //

// === ELEMENT ===  //

// Abstract interface for underlying elements
function Element (elem) {
    this.strElem = this.constructor.name;
    this.db_name = this.strElem + "s";
    if (typeof elem !== "undefined") {
	this.id = elem.id;
	this.name = elem.name;
	this.type = elem.type;
	this.state = elem.state;
	this.notes = elem.notes;
    } else {
	this.id = 0;
	this.name = "";
	this.type = 1;
	this.state = 4;
	this.notes = "";
    }
    this.selected=false;
}

// Basic behavior of elements
Element.prototype = {
    // Override in inheritance
    render: function () {},
};

// Takes a string that matches constructor.name
// And a list of objects and returns a list of
// instantiated Element (Employee, Truck, etc.)
Element.createFromList = function (classStr, list) {
    forEach(list, function (e) {
	// Little hack. Poor style, but benenifts in the situation
	// ** Added static inheritance so it will be fix **
	c_str = e.employees_type_id == 0 ? "Supervisor" : classStr;
	App.elems.push(new Global[c_str](e))
    });
};


// STATIC INTERFACE //
/* Refactoring test. Not finish */
Element.render = function (count) {
    return "Element" + "s : " + count[this.constructor.name];;
};


function Employee (emp) {
    Element.call(this, emp);
    if (typeof emp !== "undefined") {
	this.employees_type_id = emp.employees_type_id;
    } else {
	this.employees_type_id = 20 // employee_type_id
    }
    this.route = "/employees";
}
Employee.render = function (count) {
    return "Employee" + "s : " + count;
};


// EMPLOYEE BEHAVIOR

Employee.prototype = {
    
};

function Supervisor (sup) {
    Employee.call(this, sup);
    this.employees_type_id = 0;
    this.route = "/employees";
}

function Truck (truck) {
    Element.call(this, truck);
    // this.db_name = "";
    this.route = "/trucks";
}

function Box (box) {
    Element.call(this, box);
    this.route = "/boxes";
}

function Job (job) {
    Element.call(this, job);
    job = job || {};
    this.client_id = job.client_id;
    this.route = "/jobs"
}

Job.prototype = {
    get_client: function () {
	return App.elems.get(App.elems.search_index({id: this.client, strElem: 'Client'}, "by_id"));
    },
};

function Client (client) {
    Element.call(this, client);
    this.route = "/clients";
}


function Affectation () {
    this.date = new Date();
    this.date_format = this.format_date(this.date);
    this.start_time = { time : "06:00AM"};
    this.job = {};
    this.link_number = "";

    this.elems = new ElementList;

    this.notes = "";

    this.render();
}

Affectation.prototype = {
    
    is_between_dates: function (fst, snd) {
    	return Date.compare(this.date, fst) != -1 && Date.compare(this.date, snd) != 1;
    },

    add_elems: function (elems) {
	// this.elems.push(new Global[elem.strElem](elem));
	if (elem.constructor.name === "Object") elem = App.getObject(elem);
	this.elems.push(elem);
    },
    
    // Gets the object elem<Object> is representing
    // bound as an Element's subtype
    get_elems_ref: function (elems) {
	forEach(elems, get_elem_ref(elem));
    },
    
    get_elem_ref: function(elem)  {
	if (elem.constructor.name === "Object") return App.getObject(elem);
    },

    delete: function (elem) {
	var self = this;
	forEach(this.elems, function (e, i) {
	    if (e.strElem === elem.strElem && e.id === elem.id) {
		self.elems.splice(i, 1);
	    	return false;
	    }
	});
    },

    search: function (elem) {
	var found = -1;
	forEach(this.elems, function (e, i) {
	    if (e.strElem === elem.strElem && e.id === elem.id) {
		found = i
		return false;
	    }
	});
	return found
    },

    render: function () {
	this.rendered = new BaseRender(this);
    },

    week_day: function () {return Date.days[this.date.getDay()];},
    month: function () {return Date.month[this.date.getMonth()];},

    format_date: function () {
	var day = this.date.getDate();
	if (day === 1) day = "1er";

	return this.week_day() + ", le " + day + " " + this.month();
    },

    // Modification to existent Object
    copy: function (c) {
	for (prop in c) {
	    if (typeof c[prop] === "function" || this.hasOwnProperty(prop) === false) continue;
	    this[prop] = c[prop];
	    if (prop === "date") {
		this[prop] = new Date(c[prop].getFullYear(), c[prop].getMonth(), c[prop].getDate());
	    }
	}
    },

    is_today: function() {
	var today = new Date;
	return this.is_between_dates(today, today)
    },

};


/* Role : Encapsulate information needed for rendering.
 * Serve as a template model
 * 
 * 
 */

function BaseRender(affect) {
    // To prevent loop (BaseRender is in class affect)
    this.affect = this.copy(affect);
    this.render();
};

BaseRender.prototype = {
    // Keeps only attrs
    copy: function (affect) {
	var a = {};

	for (prop in affect) {
	    if (prop == "rendered" || typeof affect[prop] === "function") continue;
	    a[prop] = affect[prop];
	}

	return a;
    },
    
    render: function () {
	attrs = [{var_:"employees", elem: "Employee"}, {var_: "trucks", elem: "Truck"}, {var_: "boxes", elem: "Box", plurial:"es"}];
	self = this
	forEach(attrs, function (a) {
	    if (a.plurial === undefined) a.plurial = "s";
	    self[a.var_] = a.elem + a.plurial + " : " + (self.affect.elems.perform_count()[a.elem]);
	});
    },
};


function ListClass () {
    this.list = [];
}

ListClass.prototype = {
    get: function (index) {
	return this.list[index];
    },
    
    add_many: function (xs) {
	if (typeof xs !== 'undefined') {
	    if (typeof xs.push === "undefined") {
		xs = [xs];
	    }
	    this.list = [].concat(this.list, xs)
	}
    },

    push: function (e) {
	this.list.push(e);
    },

    insertion_sort: function(to_insert) {
	insertion_sort(this.list, to_insert, this.sort_predicate);
    },

    forEach: function (action) {
	forEach(this.list, action)
    },

    clear: function () {
	this.list = [];
    },

    // Compares e against each element, makes sure they avec same type
    // returns index
    is_include: function (needle, predicate) {
	predicate = predicate || this.eql_predicate // Will be usefull if want to pass other predicate than default class
	if (typeof predicate === "string") predicate = this[predicate];
	return search_index(this.list, needle, predicate);
    },

    search_index: function (elem, predicate) {
	return this.is_include(elem, predicate);
    },

    eql_predicate: function (needle, elem) {
	return needle === elem;
    },
    
    sort_predicate: function (is_smaller, elem) {
	return (is_smaller < elem) ? true : false
    },
  
};

// ELEMENT_LIST //

function ElementList () {
    ListClass.call(this);
    this.count = this.perform_count();
}

// === ELEMENT_LIST STATIC //


// === BEHAVIOR == //

ElementList.prototype = {
    eql: function (e) {
	return e.strElem === this.strElem && e.id === this.id;
    },
    
    perform_count: function () {
	var elem = ["Employee", "Supervisor", "Truck", "Box"];
	this.count = {Employee: 0, Supervisor: 0, Truck: 0, Box: 0};
	count = this.count;
	forEach(this.list, function(e, i) {
	    count[e.strElem]++;
	});
	
	return count;
    },

    eql_predicate: function (e, elem) {
	return e.eql(elem);
    },

    by_id: function (obj, elem) {
	return obj.id === elem.id && obj.strElem === elem.strElem;
    },

    filter_elements: function (strClass, predicate) {
	predicate = predicate || this.filter_predicate;
	return this.list.filter((function (e) {return predicate(e, strClass)}));
    },

    filter_predicate: function (e, strClass) {
	return e.strElem === strClass;
    },
};

function AffectedList() {
    ElementList.call(this);
    
};

AffectedList.prototype = {
    is_affected: function (elem) {
	
    },
    
    eql_predicate: function (searched, current) {
	return searched.elem.id === current.elem.id;
    },

    verify_affect: function (a) {
	var self = this;
	a.elems.forEach(function (e) {
	    self.push(new ElemAffected(e, a.job))
	});
    },

    filter_predicate: function (affected, strClass) {
	return affected.elem.strElem === strClass;
    },
};

// AFFECTATION_LIST

// Singleton for holding every affectation needed
function AffectationList () {
    ListClass.call(this);
}


AffectationList.prototype =  {
    sort_predicate: function (in_place, to_insert) {
	// is a_to_insert smaller to a_inplace
	return (Date.compare(to_insert.date, in_place.date) < 0) ? true : false;
    },

    filter_affectations: function (fst, snd) {
	snd = snd || fst;
	return this.list.filter(function (a) {return a.is_between_dates(fst, snd);});
    },

    get_todays: function () {
	var today = new Date;
	return this.filter_affectations(today);
    },

};

function ElemAffected(elem, job) {
    this.elem = elem;
    this.job = job;
};


// Inheritance
// Needs to be at the end because of how I declare my prototypes.
// Class.prototype = {Object:x} is my preferred syntax, but it completly shadows
// whatsoever is in the prototype before.
// Added what is needed in the extend fonction so object returns with full prototype
// And now am one step closer to implementing multiple inheritance
// In fact, I think multiple inheritance would already be working.
// But I'll implement a specialize method for it anyway. Get it cleaner and clearer.
// ** Discovery **
// The actual method break dynamic class extension. Dynamically adding method or properties to a base class
// Doesn't propagate to child class.
// ** Looks like it is fix. Will check that further down. Had done a mistake in Inherits.extend **
// ** Confirmation, it is fix **

Inherits.extend_multiple([["Employee"], ["Truck"], ["Box"], ["Job"], ["Client"], ["Supervisor", "Employee"]], "Element");
Inherits.extend_multiple([["AffectationList"], ["ElementList"], ["AffectedList", "ElementList"]], "ListClass");

// === Initialization === //

// App Model
var App = {
    
    affectations: new AffectationList,
    
    elems: new ElementList,

    affected_today: new AffectedList,
    attributed: new AffectedList,
    
    insert_affect: function (affect) {
	this.affectations.insertion_sort(affect);
	if (affect.is_today()) this.affected_today.verify_affect(affect);
    },

    verify_today: function () {
	this.affected_today.clear();
	var affected = this.affected_today;
	App.affectations.get_todays().forEach(function (a) {
	    a.elems.forEach(function (e) {
		affected.push(new ElemAffected(e, a.job))
	    });
	});
	console.log(affected);
	return affected
    },

    // returns the list of affected element
    verify_day: function (day) {
	this.attributed.clear();
	var attributed = this.attributed;
	forEach(this.affectations.filter_affectations(day), function (a) {
	    a.elems.forEach(function (e) {
		attributed.push(new ElemAffected(e, a.job));
	    });
	});
	return attributed;
    },

    test: function (elems, days, date) {
	var diff = -(date.getDay());
	var diff_array = [];
	for (var i = 0; i < 7; ++i) {
	    diff_array[i] = diff + i;
	}
	var attributed = [];

	forEach (Date.days, function (d, i) {
	    if (days[d] === true) {
		attributed = attributed.concat(App.verify_day(new Date(date.getFullYear(), date.getMonth(), date.getDate() + diff_array[i])).list);
	    }
	    ++i;
	});
	return elems.filter((function (e) {
	    var found = false;
	    forEach(attributed, function (affected) {
		return !((affected.elem.strElem === e.strElem && affected.elem.id === e.id) && (found = true))
	    });
	    // inverted because we want to filter it only if we find (true) it (false = filtered)
	    return !found;
	}))
    },
};


function User (user) {
    this.user = user;
};

User.createFromList = function (userList) {
    var users = [];
    forEach(userList, function (user) {
	users.push(new User(user));
    });
    return users;
};


// });			
