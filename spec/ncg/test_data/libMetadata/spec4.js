module.exports = {
	// testcase-1
	spec1: {
		input: {
			data: "21 E 61st St, New York, NY, United States"
		},
		output: {
			address: "21 E 61st St",
			city: "New York",
			state: "NY",
			postal_code: "",
			country: "United States"
		}
	},
	// testcase-2
	spec2: {
		input: {
			data: "Dubai Marina, Dubai, United Arab Emirates"
		},
		output: {
			address: "",
			city: "Dubai Marina",
			state: "Dubai",
			postal_code: "",
			country: "United Arab Emirates"
		}
	},
	// testcase-3
	spec3: {
		input: {
			data: "Port Andratx, 07157 - Spain"
		},
		output: {
			address: "",
			city: "Port Andratx",
			state: "",
			postal_code: "07157",
			country: "Spain"
		}
	},
	// testcase-4
	spec4: {
		input: {
			data: "Montecito, CA, 93108 - United States"
		},
		output: {
			address: "",
			city: "Montecito",
			state: "CA",
			postal_code: "93108",
			country: "United States"
		}
	},
	// testcase-5
	spec5: {
		input: {
			data: "Malmok, Aruba"
		},
		output: {
			address: "",
			city: "Malmok",
			state: "",
			postal_code: "",
			country: "Aruba"
		}
	}
};