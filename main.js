var beautify_html = require('js-beautify').html;
var fs = require('fs');
var child_process = require('child_process');
var tmpInputFilePath = '/tmp/__html2code_last_input_.html';
var tmpOutputFilePath = '/tmp/__html2code_last_output_.html'

fs.truncate(tmpInputFilePath);

var editor = process.env.EDITOR || 'vi';
var child = child_process.spawn(editor, [tmpInputFilePath], {
	stdio: 'inherit'
});

child.once('exit', function(e, code) {

	fs.readFile(tmpInputFilePath, 'utf8', function(err, data) {
		if (err) {
			throw err
		}
		var result = convert(data, {
			indent_size: 2
		});
		console.log("finished");
		fs.truncate(tmpOutputFilePath);
		fs.writeFile(tmpOutputFilePath, result, {
			encoding: 'utf8'
		}, function() {
			var editor = process.env.EDITOR || 'vi';
			var child = child_process.spawn(editor, [tmpOutputFilePath], {
				stdio: 'inherit'
			});
		})

	});
});



function beautify(html) {
	return beautify_html(html);
}

function toCode(html) {
	var prefix = "str += ";
	var result = "";
	var arr = html.split("\n");

	for (i = 0; i < arr.length; i++) {
		var line = "";
		line += prefix;
		line += "\'";
		if (!arr[i] || !arr[i].length) {
			continue;
		}
		line += arr[i].replace(/\"/g, "\\\"");
		line += "\'\n";
		result += line;
	}
	return result;
}

function convert(html) {
	var beautified = beautify(html);
	var result = toCode(beautified);
	return result;
}