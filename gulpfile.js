var args = require('yargs').argv
var gulp = require('gulp')
var rename = require('gulp-rename')
var template = require('gulp-template')
var browserify = require('gulp-browserify')
var uglify = require('gulp-uglify-es').default
var include = require('gulp-include')
var s3 = require('gulp-s3')
var connect = require('gulp-connect')
var gutil = require('gulp-util')
var cloudfront = require('gulp-cloudfront-invalidate');

var fs = require('fs');
var glob = require('glob');
var ftp = require('gulp-ftp');
var shell = require('shelljs');
var akamai = require('./akamai-cache-clear.js');

var watchPort = process.env.PORT || 8080;

// checks build environment is valid
var valid_envs = ['prod', 'sit', 'uat', 'dev'];
var env = args.env || 'dev';
if(!args.env)
    gutil.log(`*** Default environment : dev ***`);
else 
    gutil.log(`*** Environment : ${env} ***`);

if (valid_envs.indexOf(env) == -1) {
    gutil.log(`Please specify a valid environment using --env.  Options are: ${JSON.stringify(valid_envs)}`);
    process.exit()
}

// TODO: remove this variable altogether
// country is always 'us'
var country = 'us';

// Deployment config file
if (!fs.existsSync('./deploy-config.json')) {
    gutil.log('Deployment config file is missing: ./deploy-config.js');
    process.exit();
}
var deploy_config = require('./deploy-config');

// Domains config file
var domainsConfig = '';
if (fs.existsSync(`./config/config-${env}.json`)) {
    domainsConfig = `config-${env}.json`;
} else if (fs.existsSync(`./config/config.json`)) {
    domainsConfig = `config.json`;
} else {
    gutil.log(`Domain config for environment(${env}) does not exist: ./config/config-${env}.json`);
    process.exit();
}

// tags config
var tagsConfig = '';
if (fs.existsSync(`./config/tags-config-${env}.json`)) {
    tagsConfig = `tags-config-${env}.json`;
} else if (fs.existsSync(`./config/tags-config.json`)) {
    tagsConfig = 'tags-config.json';
} else {
    gutil.log(`Tags config file is missing: ./config/tags-config-${env}.json`);
    process.exit();
}


var config = {
    revision: shell.exec('git rev-parse HEAD',{silent:true}).stdout.trim(),
    date: new Date().toISOString(),
    env: env,
    country: country,
    testbase: deploy_config[env].tag,
    collector: Array.isArray(deploy_config[env].collector) ? deploy_config[env].collector.join('|') : deploy_config[env].collector,
    aapi: deploy_config[env].aapi,
    globalDomain: 'newscgp.com',
    cookieSyncPath: deploy_config[env].tag.path,
    domainsConfig: domainsConfig,
    tagsConfig: tagsConfig, // site to tag site mapping
    cookieSyncScheduleTime: (env == 'dev') ? 20 : 60*60*6,
    pageViewThrottleTime: (env == 'dev') ? 20 : 60*60*6,
    deviceIdSyncTime: (env == 'dev') ? 20: 60*60*24, // time between device id sync
    gdprEndpoint: deploy_config[env].gdprEndpoint
};

var task = {};

gulp.task('ncg-wrapper', task.ncg = function() {
    var s = gulp.src(`./src/ncg/wrapper.js`)
        .pipe(template(config))
        .pipe(include());
    if (env != 'dev' && env != 'sit') {
        s = s.pipe(uglify({ecma: 5}));
    }
    s.pipe(rename('ncg.js'));
    s = s.pipe(gulp.dest('dist'));
    return s;
});

gulp.task('ncg-js', function() {
    var s = gulp.src(['src/**/ncg/index.js']);

    s = s.pipe(template(config));
    s = s.pipe(browserify({debug : false}));
    if (env != 'dev' && env != 'sit') {
        s = s.pipe(uglify({ecma: 5}));
    }
    s = s.pipe(gulp.dest('tmp'));
    return s;
});

gulp.task('cookie-js', function() {
    var s = gulp.src('src/**/cookie/index.js');

    s = s.pipe(template(config));
    s = s.pipe(browserify({debug : false}));
    if (env != 'dev' && env != 'sit') {
        s = s.pipe(uglify({ecma: 5}));
    }
    s.pipe(rename('cookie.js'));
    s = s.pipe(gulp.dest('dist'));
    return s;
});

gulp.task('cookie-wrapper', gulp.series('cookie-js', function() {
    var s = gulp.src('src/**/cookie/wrapper.html')
        .pipe(rename('cookie.html'))
        .pipe(gulp.dest('dist'))
        .pipe(include())
        .pipe(template(config))
        .pipe(gulp.dest('dist'));
    return s;
}));

gulp.task('test', function() {
    var s = gulp.src('test/**/*.html');
    s = s.pipe(template(config));
    s = s.pipe(gulp.dest('tdist'));
    return s;
});

gulp.task('ncg', gulp.series('ncg-js', task.ncg));
gulp.task('cookie', gulp.series('cookie-wrapper'));
gulp.task('build', gulp.series('ncg','cookie', 'test'));

gulp.task('bump', function() {
    if (args.env=='prod') {
        var prev = '';
        try {
            prev = fs.readFileSync('./rev.txt').toString();
        }
        catch (e) {
        }
        var curr = shell.exec('git rev-parse HEAD',{silent:true}).stdout.trim();
        if (curr !== prev) {
            shell.exec('npm version patch');
            var curr = shell.exec('git rev-parse HEAD',{silent:true}).stdout.trim();
            fs.writeFileSync('./rev.txt', curr);
        }
    }
});

gulp.task('ftp', gulp.series('build', function () {
    if (env == 'dev') throw new gutil.PluginError('deploy', 'Please specify a non-dev environment using the --env flag to deploy. Options are: ' + JSON.stringify(valid_envs));
    var ftpp = JSON.parse(fs.readFileSync('.ftppass'));
    return gulp.src('dist/**/*')
        .pipe(ftp({
            host: 'ndmdsa.upload.akamai.com',
            port: 21,
            remotePath: '/280274/'+ env + '/ncg',
            user: ftpp.username,
            pass: ftpp.password
        }));
}));

gulp.task('deploy-akamai', gulp.series('ftp', function() {
    var akamaip = JSON.parse(fs.readFileSync('.akamaipass'));
    var urls = [];
    var files = glob.sync('dist/**/*');
    for (var i in files) {
        urls.push('http://tags.news.com.au/'+ env +'/ncg/' + files[i].substring(5));
        urls.push('https://tags.news.com.au/'+ env +'/ncg/' + files[i].substring(5));
    }
    akamai(urls, akamaip.username, akamaip.password);
}));

gulp.task('deploy-s3', gulp.series('build', function() {
    var options = {
        uploadPath: env +'/ncg/',
        headers: {
            'Cache-Control': 'max-age=3600'
        }
    }
    var aws = {};
    aws.bucket = deploy_config[env].bucket;
    aws.region = deploy_config[env].region;
    aws.key = process.env.AWS_ACCESS_KEY_ID;
    aws.secret = process.env.AWS_SECRET_ACCESS_KEY;
    if (process.env.AWS_SECURITY_TOKEN) aws.token = process.env.AWS_SECURITY_TOKEN;
    if (process.env.AWS_SESSION_TOKEN) aws.token = process.env.AWS_SESSION_TOKEN;
    var aws_inv = {};
    aws_inv.distribution = deploy_config[env].cloudfrontID;    // Cloudfront distribution ID 
    aws_inv.paths = ['/*'];                                             // Paths to invalidate 
    aws_inv.accessKeyId = aws.key;                                       // AWS Access Key ID 
    aws_inv.secretAccessKey = aws.secret;                                // AWS Secret Access Key 
    if (aws.token) aws_inv.sessionToken = aws.token;                     // Optional AWS Session Token 
    aws_inv.wait = false;     
    return gulp.src('./dist/**/*')
        .pipe(s3(aws, options))
        .pipe(cloudfront(aws_inv));
}));

gulp.task('deploy',gulp.series('deploy-s3', 'bump'));

var cors = function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', '*');
    next();
};


gulp.task('watch', gulp.series('build', function() {
    connect.server({
        port: watchPort,
        middleware: function () {
            return [cors];
        }
    });
    gulp.watch(['src/**/*.*','ncg.js','config/**/*.*','test/**/*.*'], gulp.series('build'));
}));

gulp.task('watch-noserver', gulp.series('build', function() {
    gulp.watch(['src/**/*.*','ncg.js','config/**/*.*','test/**/*.*'], ['build']);
}));

gulp.task('default', gulp.series('build'));