/* Akamai cache clear */

var https = require('https');

// Command line arguments
// Usage: node akamai-cache-clear.js url username password



var purge = function(urls, username, password, callback) {
	var reqData = JSON.stringify({objects: urls});
	var options = {
		hostname: 'api.ccu.akamai.com',
		port: 443,
		path: '/ccu/v2/queues/default',
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'Content-Length': reqData.length,
		},
		auth: username + ':' + password,
	};

	var req = https.request(options, function(res) {

		res.setEncoding('utf8');
		var buffer = '';
		res.on('data', function(chunk) {
			buffer += chunk;
		});
		res.on('end', function () {
			if (res.statusCode != 201) {
				console.error('Error in purge request: ' + res.statusCode);
				console.error(res.headers);
				console.error(buffer);
				process.exit(1);
			}
			data = JSON.parse(buffer);
			// Check a bit early just in case :) (it always seems to return 420 seconds)
			callback(data.progressUri, /*data.estimatedSeconds ||*/ 300);
		});
	});

	req.write(reqData);
	req.end();
};

var check = function(progressUri, username, password, done) {
	var options = {
		hostname: 'api.ccu.akamai.com',
		port: 443,
		path: progressUri,
		headers: {
			'Content-Type': 'application/json',
		},
		auth: username + ':' + password,
	};

	var req = https.get(options, function(res) {
		res.setEncoding('utf8');
		var buffer = '';
		res.on('data', function(chunk) {
			buffer += chunk;
		});
		res.on('end', function () {
			if (res.statusCode != 200) {
				console.error('Error in check request: ' + res.statusCode);
				console.error(res.headers);
				console.error(buffer);
				process.exit(2);
			}
			data = JSON.parse(buffer);
			done(data.purgeStatus === 'Done', data.pingAfterSeconds);
		});
	});
};
var progressWaitFor = function(seconds, increment, done) {
	if (seconds < increment) increment = seconds;
	seconds -= increment;
	setTimeout(function() {
		if (seconds <= 0) {
			done();
		} else {
			console.log('' + seconds + ' seconds...');
			progressWaitFor(seconds, increment, done);
		}
	}, increment*1000);
}
var checkLoop = function(progressUri, waitSeconds, username, password, doneCallback) {
	var callback = function(done, waitSeconds) {
		if (done) {
			doneCallback();
		} else {
			waitSeconds = waitSeconds || 60;
			checkLoop(progressUri, waitSeconds, username, password, doneCallback);
		}
	}
	console.log('Checking status in ' + waitSeconds + ' seconds...');
	progressWaitFor(waitSeconds, 30, function() {
		console.log('Checking status now');
		check(progressUri, username, password, callback)
	});
}

module.exports = function(url, username, password) {
    console.log('Purging ' + url + ' as ' + username);
    purge(url, username, password, function(progressUri, waitSeconds) {
        console.log('Purge request successful, waiting for fulfillment');
        checkLoop(progressUri, waitSeconds, username, password, function() {
            console.log('Purge successful');
        });
    });
}

if (require.main == module) {
    var urls = [process.argv[2]];
    var username = process.argv[3];
    var password = process.argv[4];

    module.exports(urls, username, password);
}
