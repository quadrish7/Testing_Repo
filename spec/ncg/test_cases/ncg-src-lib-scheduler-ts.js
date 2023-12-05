describe("ncg-src-lib-scheduler-testSuite.js", function() {

	// OBJECTIVE  
		// To test the localStorage based scheduler logic behavior

	// GENERAL conditions to be checked across all test cases  
		// Check for localStorage support of the environment i.e PhantomJS, browsers like chrome etc...

	// ASSUMPTIONs
		// localStorage API is supported by the browsers

	// TEST library methods
		// checkOrSchedule(identifier, time) 
		// update(identifier, time)
		// remove(identifier)

	// TEST_CASES

		// TEST_SPEC_1 ::: localStorage API support
			// check for support in browser environment

		// TEST_SPEC_2 ::: Test first time scheduler setup 
			// -> checkOrSchedule -> return value : true 

		// TEST_SPEC_3 ::: setup a scheduler with x seconds interval, remove it and then setup same again 
			// -> update
			// -> remove
			// -> checkOrSchedule -> return value : true 

		// TEST_SPEC_4 ::: setup a scheduler with x seconds interval, and then setup the same scheduler with a different y seconds interval
			// -> checkOrSchedule -> with x seconds interval
			// -> checkOrSchedule -> with y seconds interval -> return value : true

		// TEST_SPEC_5 ::: setup a scheduler with x seconds interval, and then setup the same scheduler again with same x seconds interval
			// -> checkOrSchedule -> with x seconds interval
			// -> checkOrSchedule -> with x seconds interval -> return value : false

		// TEST_SPEC_6 ::: setup a scheduler with x seconds interval, update last runtime and then check whether a scheduler run is needed before x seconds interval
			// -> checkOrSchedule
			// -> update
			// -> checkOrSchedule -> return value : false

		// TEST_SPEC_7 ::: setup a scheduler with x seconds interval and then check whether a scheduler run is needed after x seconds interval
			// -> checkOrSchedule
			// -> setTimeout to add delay and -> update				
			// -> setTimeout to add delay and -> checkOrSchedule -> return value : true 
			

	// local vars 	
    var scheduler	= require('../../../src/lib/scheduler')('_ncg_sch_');

	// TEST_SPEC_1
	it("Test Scheduler Data Storage API support", function() {
		expect(window.localStorage || document.cookie).toBeDefined();
	});

	// TEST_SPEC_2
	it("Test Scheduler Setup First time", function() {
		// get test case data 
		var spec_input      = ["test_scheduler1",20]; // interval = 20 seconds
		var spec_output     = true;
		var actual_output   = scheduler.checkOrSchedule.apply(scheduler,spec_input);
		// run test cases 
		expect(actual_output).toEqual(spec_output);
	});

	// TEST_SPEC_3
	it("Test Scheduler Setup After Reset", function() {
		// get test case data 
		var spec_input      = ["test_scheduler2",20]; // interval = 20 seconds
		var spec_output     = true;

		scheduler.update.apply(scheduler,spec_input);
		scheduler.remove.apply(scheduler,["test_scheduler2"]);
		var actual_output   = scheduler.checkOrSchedule.apply(scheduler,spec_input);
		// run test cases 
		expect(actual_output).toEqual(spec_output);
	});

	// TEST_SPEC_4
	it("Test Scheduler Setup with Modified Interval", function(done) {
		// get test case data 
		var spec_input1     = ["test_scheduler3",20]; // interval1 = 20 seconds
		var spec_input2     = ["test_scheduler3",30]; // interval2 = 30 seconds
		var spec_output     = true;

		// STEP1: setup a new scheduler with 20 seconds interval 
		scheduler.checkOrSchedule.apply(scheduler,spec_input1);
		scheduler.update.apply(scheduler,["test_scheduler3"]);

		// STEP2: setup the same scheduler with new interval after some time
		setTimeout(function(){
			var actual_output = scheduler.checkOrSchedule.apply(scheduler,spec_input2);
			expect(actual_output).toEqual(spec_output);
			done();
		},1500);  // timeout = 1.5 seconds

	});

	// TEST_SPEC_5
	it("Test Scheduler Setup Again with Same Interval", function(done) {
		// get test case data 
		var spec_input1     = ["test_scheduler5",20]; // interval1 = 20 seconds
		var spec_input2     = ["test_scheduler5",20]; // interval2 = 20 seconds
		var spec_output     = false;

		// STEP1: setup a new scheduler with 20 seconds interval 
		scheduler.checkOrSchedule.apply(scheduler,spec_input1);
		scheduler.update.apply(scheduler,["test_scheduler5"]);

		// STEP2: setup the same scheduler with same interval after some time
		setTimeout(function(){
			var actual_output = scheduler.checkOrSchedule.apply(scheduler,spec_input2);
			expect(actual_output).toEqual(spec_output);
			done();
		},1500);  // timeout = 1.5 seconds

	});

	// TEST_SPEC_6
	it("Test Scheduler needToRun State Within Interval", function(done) {
		// get test case data 
		var spec_input      = ["test_scheduler6",3]; // interval = 3 seconds
		var spec_output     = false;
		//jasmine.clock().install();

		// STEP1: setup a new scheduler with 3 seconds interval 
		scheduler.checkOrSchedule.apply(scheduler,spec_input);

		// STEP2: update scheduler runtime after 0.5 seconds (i.e 0.5 < 3 seconds interval)
		setTimeout(function(){
			scheduler.update.apply(scheduler,["test_scheduler6"]);
		},500); // timeout = 0.5 seconds

		// STEP3: check for scheduler run state after 1.5 seconds (i.e 1.5 < 3 seconds interval)
		setTimeout(function(){
			var actual_output = scheduler.checkOrSchedule.apply(scheduler,spec_input);
			expect(actual_output).toEqual(spec_output);
			done();
		},1500);  // timeout = 1.5 seconds = 500 + 1000

		//jasmine.clock().tick(1500);
		//jasmine.clock().tick(3000);
		//jasmine.clock().uninstall();
	});

	// TEST_SPEC_7
	it("Test Scheduler needToRun State After Interval", function(done) {
		// get test case data 
		var spec_input      = ["test_scheduler7",2]; // interval = 2 seconds
		var spec_output     = true;

		// STEP1: setup a new scheduler with 2 seconds interval 
		scheduler.checkOrSchedule.apply(scheduler,spec_input);

		// STEP2: check for scheduler run state after 3 seconds (i.e 3 > 2 seconds interval)
		setTimeout(function(){
			var actual_output = scheduler.checkOrSchedule.apply(scheduler,spec_input);
			expect(actual_output).toEqual(spec_output);
			done();
		},3000);  // timeout = 3 seconds = 2000 + 1000

	});

});