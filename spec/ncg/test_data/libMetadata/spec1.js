var name  = "TEST_meta_name1";
var value = "TEST_meta_value1";
var meta_html = "";
	meta_html += '<meta name="'+name+'" content="'+value+'" />';
	meta_html += '<meta name="prefix_'+name+'" content="'+value+'" />';
	meta_html += '<meta name="'+name+'_suffix" content="'+value+'" />';

module.exports = {
	input: {
		data: name,
		metaHTML: meta_html
	},
	output: value
};