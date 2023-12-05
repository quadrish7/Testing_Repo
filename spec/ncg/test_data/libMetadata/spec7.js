module.exports = {
	// spec1
	spec1: {
		input: {
			section: "default-section1",
			subsection: "default-subsection2",
			subsubsection: "",
			urlPathnameSections: ["url-section1","url-subsection2"],
			parseLimit: 2
		},
		output: ["default-section1","default-subsection2"]
	},
	// spec2
	spec2: {
		input: {
			section: "default-section1",
			subsection: "",
			subsubsection: "",
			urlPathnameSections: ["url-section1","url-subsection2"],
			parseLimit: 2
		},
		output: ["default-section1","url-section1"]
	},
	// spec3
	spec3: {
		input: {
			section: "default-section1",
			subsection: "",
			subsubsection: "",
			urlPathnameSections: ["url-section1","url-subsection2"],
			parseLimit: 3
		},
		output: ["default-section1","url-section1","url-subsection2"]
	},
	// spec4
	spec4: {
		input: {
			section: "default-section1",
			subsection: "",
			subsubsection: "default-subsubsection3",
			urlPathnameSections: ["url-section1","url-subsection2"],
			parseLimit: 3
		},
		output: ["default-section1","url-section1","default-subsubsection3"]
	},
	// spec5
	spec5: {
		input: {
			section: "",
			subsection: "",
			subsubsection: "default-subsubsection3",
			urlPathnameSections: ["url-section1","url-subsection2","url-subsubsection3"],
			parseLimit: 4
		},
		output: ["url-section1","url-subsection2","default-subsubsection3","url-subsubsection3"]
	},
	// spec6
	spec6: {
		input: {
			section: "",
			subsection: "",
			subsubsection: "default-subsubsection3",
			urlPathnameSections: ["url-section1","url-subsection2","url-subsubsection3","url-subsubsubsection4"],
			parseLimit: 5
		},
		output: ["url-section1","url-subsection2","default-subsubsection3","url-subsubsection3","url-subsubsubsection4"]
	}
};