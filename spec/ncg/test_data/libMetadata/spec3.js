var name  = "TEST_meta_name3";
var value = "TEST_meta_value3";
var meta_html = "";
	meta_html += '<meta name="prefix_'+name+'" content="'+value+'" />';
	meta_html += '<meta property="prefix_'+name+'_suffix" content="'+value+'" />';
	meta_html += '<meta name="'+name+'_suffix" content="'+value+'" />';

module.exports = {
	input: {
		data: name,
		metaHTML: meta_html
	},
	output: undefined
};