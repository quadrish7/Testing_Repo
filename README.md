# News Connect Global Tracker

An Javascript tracker library for News Connect Global

## Implementation

```
<script type="text/javascript">
	ncg_data = window.ncg_data || {};
	// User information
	ncg_data.user_id = 'my logged in id';
	ncg_data.user_provider = 'my id provider'; // Eg: gygia | auth0
	ncg_data.user_memtype = 'subscriber'; // anonymous | subscriber | registered 
                                          // (default if not set is 'anonymous')
	// Newsletter subscriptions
	ncg_data.user_newsletter_id = 'my newsletter id';
	ncg_data.user_newsletter_provider = 'my newsletter provider'; // Eg: SalesForce | MailChimp | CampaignMonitor

	// If your DMP creates a unique id
	// for this browser, enter it here.
	// If you use more than DMP, enter the details for your main one.
	ncg_data.browser_dmp_id = 'my dmp id';
	ncg_data.browser_dmp_provider = 'my dmp provider'; // Eg: krux | bluekai

	// Ads PPID
	// If you send a Publisher Provided Id, or some other unique User Id
	// with your ads requests, please enter it here
	// PLEASE MAKE SURE THAT THIS ID IS TARGETABLE FOR AD SERVING.
	ncg_data.browser_ads_ppid = 'my ppid';
	ncg_data.browser_ads_provider = 'my ads platform'; // Eg: dfp 

	// If your Analytics platform creates a unique id
	// for this browser, enter it here.
	// If you use more than Analytics platform, enter the details for your main one.
	ncg_data.browser_analytics_id = 'my analytics id';
	ncg_data.browser_analytics_provider = 'my analytics provider'; // Eg: omniture | ga
	
	// Any additional unique identifiers you have
	ncg_data.extra_ids = window.ncg_data.user_extra_ids || [];
	ncg_data.extra_ids.push({provider: 'some id provider', id: 'some id'});
	ncg_data.extra_ids.push({provider: 'some other id provider', id: 'some other id'});

	// Load the library
	// This can be done from a tag manager, like Tealium IQ or GTM
	(function() {
        var head = document.head || document.getElementsByTagName('head')[0],
            scr = document.createElement('script')
            scr.async = true;
            scr.src = '//us.tags.newscgp.com/prod/ncg/ncg.js';
            head.appendChild(scr);
	}());
</script>
```

### Advanced config

```
<script type="text/javascript">
	// Defer auto-trigger
	ncg_data.defer = true;
	// Now triger
	ncg_data.events = window.ncg_data.events || [];
	ncg_data.events.push(['pageview']);
</script>
```

### Setting custom App ID -- Removed from Latest Snowplow Tracker Version
News ID system uses __newsconnect-global__ as default application id for event tracking.
Other application id currently supported by NewsID system is **knewz**.

The first line of the NewsID integration should set app id, if you want to override default app id. 
For example, the following snippet sets app id to __knewz__ 

```
window._ncg_snowplow('setAppId', 'knewz')
```

### Opt-out and opt-in

```
<script type="text/javascript">
	// Need to makse sure ncg is ready
	ncg_data.events = window.ncg_data.events || [];
	ncg_data.events.push(['ready', function() {
		// Opt out
		this.optOut();
		// Opt in
		this.optIn();
	}]);
</script>
```

## Build and Deployment
### Install Node Modules : 
	npm install

### To build:
	gulp build
#### Default environment : prod

Prod :

	gulp build --env prod

Dev :

	gulp build --env dev

SIT :

	gulp build --env sit

UAT :

	gulp build --env sit

### To develop:
Run:

	gulp watch 

### To deploy:

Make sure the following AWS credentials are set in you environment variables for the dev environment, your deploying to:

	AWS_ACCESS_KEY_ID
	AWS_SECRET_ACCESS_KEY
	AWS_SECURITY_TOKEN (if needed)

UAT:
  
    gulp deploy --env uat

PROD:
  
    gulp deploy --env prod 

## To update the included Snowplow library

ncg.js bundles a standard Snowplow JavaScript tracker. To allow eventual debugging of native Snowplow errors, this included tracker is the built/unminified version.

To get this version, download the latest snowplow javascript tracker source from [https://github.com/snowplow/snowplow-javascript-tracker/releases/tag/2.7.0]() (replace the tag with the latest release)

On the snowplow source folder run:

	npm install
	grunt

Then copy the resulting `dist/snowplow.js` into this repo in `src/vendors`

### Automated unit Tests

Frameworks: Jasmine for BDD, Karma as test runner.

	npm install -g jasmine
	npm install -g karma-cli

To run tests in CI mode, use

	-- Headless with Chrome
	karma start --browsers Chrome
	-- Headless with PhantomJS
	karma start --browsers PhantomJS

To run tests and return

	npm test

Test specs are in spec/ncg

To generate code coverage report and return

	npm run test-coverage

Test coverage reports can be generated and available from coverage/ folder after running above command

