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
	this.type = "";
	this.state = 1;
	this.notes = "";
	this.supervisor = false;
    }
    this.selected=false;
}

// Basic behavior of elements
Element.prototype = {
    // Override in inheritance
    render: function () {},

    get_deletion_confirmation: function(text) {
	text = text || this.name;
	return confirm("Supprimer " + text + "?");
    },
};

// Takes a string that matches constructor.name
// And a list of objects and returns a list of
// instantiated Element (Employee, Truck, etc.)
Element.createFromList = function (classStr, list, deferred) {
    // console.log("Started " + classStr, (new Date).getSeconds(), App.elems);
    forEach(list, function (e) {
	// Little hack. Poor style, but benenifts in the situation
	// ** Added static inheritance so it will be fix **
	c_str = e.supervisor === true ? "Supervisor" : classStr;
	App.elems.push(new Global[c_str](e))
    });
    // console.log("Done " + classStr, (new Date).getSeconds(), App.elems);
    //deferred.resolve();
    //return deferred.resolve();
};


// STATIC INTERFACE //
/* Refactoring test. Not finish */
Element.render = function (count) {
    return "Element" + "s : " + count[this.constructor.name];;
};


function Employee (emp) {
    Element.call(this, emp);
    if (typeof emp !== "undefined") {
	this.supervisor = emp.supervisor;
	this.employees_type_id = emp.employees_type_id;
	this.set_string_type();
    } else {
	this.employees_type_id = this.employees_type_id || 2; // if already defined by Supervisor constructor
    }
    this.route = "/employees";
}
Employee.render = function (count) {
    return "Employee" + "s : " + count;
};

// EMPLOYEE BEHAVIOR

Employee.prototype = {
    set_string_type: function () {
	this.type = App.elems.get(search_index(App.elems.list, this.employees_type_id, function (e, type_id) {
	    return e.id === type_id && e.strElem === "EmployeesType";
	})).type;
	return this.type;
    },

   // get_deletion_confirmation: function() {
   //     return this.constructor.superClass.get_deletion_confirmation(this.name);
   // },
};

function Supervisor (sup) {
    this.employees_type_id = 0;
    Employee.call(this, sup);
    this.supervisor = true;
    this.route = "/employees";
}

function EmployeesType (emp_type) {
    Element.call(this, emp_type);
    if (typeof emp_type === "undefined") this.type = ""; // Hack. Type is used as name property here
    this.route = "/employees_types";
}

EmployeesType.prototype = {
    get_deletion_confirmation: function() {
       return this.constructor.superClass.get_deletion_confirmation(this.type);
    },
};


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
    client = client || {};
    this.ref_number = client.ref_number;
    this.contact = client.contact;
    this.city = client.city;
    this.postal_code = client.postal_code;
    this.casa_salesman = client.casa_salesman;
    this.address = client.address;
    this.phone = client.phone;
    this.route = "/clients";
}


function Affectation () {
    this.date = new Date();
    this.date_format = this.format_date(this.date);
    this.start_time = { time : "06:00AM"};
    this.client_id = 1;
    this.supervisor_id = 1
    this.link_number = "";

    this.elems = new ElementList;

    this.notes = "";
    this.height = Affectation.DEF_HEIGHT;
    //this.render();
}

Affectation.createFromList = function (data_base_affectations) {
    // console.log("Started affectations", (new Date).getSeconds(), App.elems);
    forEach (data_base_affectations, function (dba) {
	a = new Affectation;
	a.id = dba.id
	a.date = new Date(dba.day);
	a.date_format = a.format_date(a.date);
	a.start_time = { time : dba.start_time};
	a.supervisor_id = dba.supervisor_id;
	a.client_id = dba.client_id;
	a.link_number = dba.link_number;
	
	a.state = dba.state
	a.end_time = dba.end_time; // Not usefull for now
	a.user_id = dba.user_id;
	a.affectation_type = dba.affectation_type;
	a.notes = dba.notes;
	dba.elements = eval(dba.elements);
	forEach(dba.elements, function (e) {
	    a.elems.push(App.elems.get(App.elems.search_index(e, function (elem, e) {return e.id === elem.id && e.strElem === elem.strElem})));
	});
	a.height = Affectation.get_height(a);
	App.insert_affect(a);
    });
    
    // console.log("Done affectations", (new Date).getSeconds());
};

Affectation.DEF_HEIGHT = 520;
Affectation.MAX_LINES = 23;
Affectation.MAX_CHARS_PER_LINE = 38;
Affectation.INIT_HEIGHT = 4 // Number of line initially => one for date, one for client, one for link number and one for Supervisor
Affectation.PADDING = 11; // Need it so a doubled affectatation is precisely the same size as two single

// If height is over 20 lines (little formula, pretty simple)
Affectation.get_height = function (a) {
    return Affectation.get_line_count(a) > Affectation.MAX_LINES ?
	Affectation.DEF_HEIGHT * 2 + Affectation.PADDING :
	Affectation.DEF_HEIGHT;
};

Affectation.get_line_count = function (a) {
    return Affectation.INIT_HEIGHT + a.elems.list.length + Math.ceil(a.notes.length / Affectation.MAX_CHARS_PER_LINE);
};

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
    // Unused.
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

    get_client: function() {
	var client = App.elems.get_by_id({id: this.client_id, strElem: "Client"})
	if (client === undefined) client = {};
	return client;
    },

    get_supervisor: function () {
	var supervisor = App.elems.get_by_id({id: this.supervisor_id, strElem: "Supervisor"})
	if (supervisor === undefined) supervisor = {};
	return supervisor;
    },

};

function PostAffectation(a) {
    this.state = 4; // Not usefull for now
    this.end_time = ""; // Not usefull for now
    this.user_id = 0;
    this.affectation_type = 0;

    this.supervisor_id = a.supervisor_id
    this.start_time = a.start_time.time;
    this.day = a.date.getTime();
    this.notes = a.notes;
    this.link_number = a.link_number;
    this.client_id = a.client_id;
    
    this.elements = this.setElems(a);
}

PostAffectation.prototype = {
    setElems: function (a) {
	var elements = [];
	a.elems.forEach(function (e) {
	    elements.push({id: e.id, strElem: e.strElem})
	});
	return elements;
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
	if (this.list[index] === undefined) return {};
	return this.list[index];
    },
    
    get_by_id: function (id) {
	return this.get(this.search_index(id, "by_id"));
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
    
    delete: function (i) {
	this.list.splice(i, 1);
    },

    find_and_delete: function (elem) {
	// Assume if its not object, its id
	this.delete(this.search_index(elem, "by_id"));
    },

    insertion_sort: function(to_insert, predicate) {
	predicate = predicate || this.sort_predicate;
	if (typeof predicate === "string") predicate = this[predicate];
	insertion_sort(this.list, to_insert, predicate);
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
	return (search_index(this.list, needle, predicate) !== false);
    },

    search_index: function (elem, predicate) {
	predicate = predicate || this.eql_predicate // Will be usefull if want to pass other predicate than default class
	if (typeof predicate === "string") predicate = this[predicate];
	return search_index(this.list, elem, predicate);
    },

    eql_predicate: function (needle, elem) {
	return needle === elem;
    },
    
    sort_predicate: function (is_smaller, elem) {
	return (is_smaller < elem) ? true : false
    },

    by_id: function (elem, searched_id) {
	return searched_id === elem.id;
    }

  
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

    filter_supervisors: function () {
	return this.list.filter(function (e) {return e.supervisor === true;});
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
function AffectationList (list) {
    ListClass.call(this);
    this.list = list || [];
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
    
    filter_by_field : function (field, needle) {
	if (needle === undefined || needle.length === 0) return this;
	return new AffectationList(this.list.filter(function (a) {
	    return (needle.length === 0) || new RegExp('(^|\\s)' + needle).test(a[field]);
	}));
    },

    filter_by_client: function (client) {
	if (client === undefined || client.length === 0) return this;
	return new AffectationList(this.list.filter(function (a) {
	    return (client.length === 0) || new RegExp('(^|\\s)' + client).test(a.get_client().name);
	}));
    },

    filter_by_elem: function (element) {
	if (element === undefined || element.length === 0) return this;
	return new AffectationList(this.list.filter(function (a) {
	    return a.elems.is_include(element, function (elem, elem_name) {
		// Search beginning (^) or each word (\\s)
		// console.log(elem.name, new RegExp('(^|\\s)' + elem_name), new RegExp('(^|\\s)' + elem_name).test(elem.name));
		return new RegExp('(^|\\s)' + elem_name).test(elem.name);
	    });
	}));
    },

    get_todays: function () {
	var today = new Date;
	return this.filter_affectations(today);
    },

    sort_for_long_affect_predicate: function (is_smaller, elem) {
	return (is_smaller <= elem) ? true : false
    },

};

function ElemAffected(elem, a) {
    this.elem = elem || {};
    this.affect_name = "";
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

Inherits.extend_multiple([["Employee"], ["Truck"], ["Box"], ["Job"], ["Client"], ["Supervisor", "Employee"], ["EmployeesType"]], "Element");
Inherits.extend_multiple([["AffectationList"], ["ElementList"], ["AffectedList", "ElementList"]], "ListClass");

// === Initialization === //

// App Model
var App = {
    
    affectations: new AffectationList,
    
    elems: new ElementList,

    affected_today: new AffectedList,
    attributed: new AffectedList,

    insert_affect: function (affect) {
	var predicate = affect.height > Affectation.DEF_HEIGHT ? "sort_for_long_affect_predicate" : "sort_predicate";
	this.affectations.insertion_sort(affect, predicate);
	if (affect.is_today()) this.affected_today.verify_affect(affect);
    },

    verify_today: function () {
	this.affected_today.clear();
	var affected = this.affected_today;
	App.affectations.get_todays().forEach(function (a) {
	    a.elems.forEach(function (e) {
		affected.push(new ElemAffected(e, a.name))
	    });
	});
	
	return affected
    },

    // returns the list of affected element
    verify_day: function (day) {
	this.attributed.clear();
	var attributed = this.attributed;
	forEach(this.affectations.filter_affectations(day), function (a) {
	    a.elems.forEach(function (e) {
		attributed.push(new ElemAffected(e, a));
	    });
	});
	return attributed;
    },

    test: function (elems, days, date, supervisor_id) {
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

	    // Don't filter if it's selected
	    if (!e.selected) {
		forEach(attributed, function (affected) {
		    return !((affected.elem.strElem === e.strElem && affected.elem.id === e.id)
			     && !(affected.elem.id === supervisor_id && affected.elem.strElem === 'Supervisor')
			     && (found = true))
		});
	    }
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
