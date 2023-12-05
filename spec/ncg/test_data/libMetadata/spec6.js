module.exports = {	
	spec1: {
		"location.pathname": "/section1/01-08-2017/subsection3/subsubsection4/subsubsubsubsection5",	
		input: 2,
		output: ['section1','','']
	},

	spec2: {
		"location.pathname": "/section1/01-08-2017/subsection3/subsubsection4/subsubsubsubsection5",	
		input: 3,
		output: ['section1','','subsection3','']
	},

	spec3: {
		"location.pathname": "/section1/01-08-2017/subsection3/subsubsection4/subsubsubsubsection5",	
		input: 4,
		output: ['section1','','subsection3','subsubsection4','']
	},

	spec4: {
		"location.pathname": "/section1/3-rooms/subsection3/subsubsection4/subsubsubsubsection5",	
		input: 4,
		output: ['section1','3-rooms','subsection3','subsubsection4','']
	}
};