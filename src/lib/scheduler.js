/*
 * This library provides generic helper functions to manage scheduling of pixels (or other tasks)
 * It does not provide the actual scheduling logic, just the means of saving, retrieving and checking schedules.
 */
var local = require('./local');

var Scheduler = function(name) {
    if (!(this instanceof Scheduler)) return new Scheduler(name);
    else Scheduler.prototype.init.call(this, name);
};

Scheduler.prototype = {

	local_name: '',

	init: function(name) {
		this.local_name = name || 'sch';
		this.load();
	},

	/*
	 * Load schedule settings from LocalStorage
	 */
	load: function() {
		this.sch = local.get(this.local_name);
		try {
			this.sch = JSON.parse(this.sch);
		}
		catch (e) {
			this.sch = {};
		}
	},

	/*
	 * Save schedule settings back to localStorgae
	 */
	save: function() {
		local.set(this.local_name, JSON.stringify(this.sch));
	},

	/*
	 * Remove schedule settings for given identifier
	 */
	remove: function(identifier) {
		this.load();
		delete(this.sch[identifier]);
		this.save();
	},

	/*
	 * Add a schedule for the given identifier.
	 * @seconds Time before expiration
	 */
	schedule: function(identifier, seconds) {
		this.load();
		// t = schedule time
	    // l = last
		this.sch[identifier] = {
			t: seconds,
			l: null
		};
		this.save();
	},

	/*
	 * Update the last time run for this identifier
	 */
	update: function(identifier, time) {
		this.load();
		if (!time) var time = Math.floor(new Date().getTime()/1000);
		if (this.sch[identifier]) {
			this.sch[identifier].l = time;
			this.save();
			return true;
		}
		return false;
	},

	/*
	 * Return:
	 *	true: if identifier should run
	 * 	false: if identifier shouldn't run
	 *	-1: if identifier is not defined in schedule
	 */
	check: function(identifier) {
		if (this.sch[identifier]) {
			var t = Math.floor(new Date().getTime()/1000);
			if (!this.sch[identifier].l || (this.sch[identifier].l + this.sch[identifier].t) <= t) {
				return true;
			}
			else {
				return false;
			}
		}
		return -1;
	},

	/*
	 * Return:
	 * The time the current idetifier is set to, or null
	 */
	time: function(identifier) {
		return (this.sch[identifier] && this.sch[identifier].t) ?  this.sch[identifier].t : null;
	},

	/*
	 * Check if the identifier should run.
	 * If it hasn't been defined before, or the time defined has changed
	 * then schedule it for the time given
	 */
	checkOrSchedule: function(identifier, time) {
		var check = this.check(identifier);
		if (check === -1 || this.time(identifier) !== time) {
			this.schedule(identifier, time);
			check = true;
		}
		return check;
	}
};

module.exports = Scheduler;