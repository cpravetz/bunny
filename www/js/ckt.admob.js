if (this._cordovaNative) {

    var admobOptions = {};
    var adMobConfigured = false;

    if (/(android)/i.test(navigator.userAgent)) {  // for android & amazon-fireos
	    admobOptions = {
		    appId: "ca-app-pub-7124522495709382~5720702136",
		    bannerAdId: 'ca-app-pub-3940256099942544/6300978111',
		    interstitialAdId: 'ca-app-pub-7124522495709382/3512522955', //'ca-app-pub-7124522495709382/6899853210',
		    appOpenAdId: "",
		    isTesting: true,
		    adExtras: {},
		    autoShowInterstitial: true,
		    autoShowRewarded: false
	    }
    } else if (/(ipod|iphone|ipad)/i.test(navigator.userAgent)) {  // for ios
	    admobOptions = {
		    appId: "",
		    bannerAdId: 'ca-app-pub-3940256099942544/2934735716',
		    interstitialAdId: 'ca-app-pub-3940256099942544/4411468910', //'ca-app-pub-7124522495709382/7143395794',
		    appOpenAdId: "",
		    isTesting: true,
		    adExtras: {},
		    autoShowInterstitial: true,
		    autoShowRewarded: false
	    }
    }


    thisSucceeded = function(t, s) {
	    console.log(t+' succeeded');
	    window.cktadmob.adStatus = s;
    }

    thisFailed = function(t) {
	    console.log(t+' failed');
    	window.cktadmob.adStatus = 'failed:'+t;
    }

    configAdMob = function() {
	    adMobConfigured = true;
    	console.log('configing admob');
    	window.cktadmob.adStatus = 'initialized';
    	admob.setOptions(admobOptions, function() {thisSucceeded('setOptions', 'initialized')}, function(e) {thisFailed(e+' setOptions')});
    	window.cktadmob.lastRequestTime = 0;
    	window.cktadmob.lastReceivedTime = 0;
    	window.cktadmob.lastShownTime = 0;
    	window.cktadmob.lastClosedTime = 0;

    	window.cktadmob.GetAnAdReady = function() {
            if (window.cktadmob.adStatus != 'requested' && window.cktadmob.adStatus != 'requesting' && window.cktadmob.adStatus != 'loaded') {
				console.log('Ad requested');
				window.cktadmob.lastRequestTime = new Date();
				window.cktadmob.adStatus = 'requesting';
				admob.requestInterstitialAd(admobOptions, function() {thisSucceeded('Request', 'loaded')}, function(e) {thisFailed(e+' Request')});
			}
	    };

    	window.cktadmob.ShowAnAd = function(followUp) {
	    	if (window.cktadmob.adStatus == 'loaded') {
				window.cktadmob.adStatus = 'shown';
				window.cktadmob.followUp = followUp;
		    	admob.showInterstitialAd(function() {thisSucceeded('Show', 'shown')}, function(e) {thisFailed(e+' Show')});
			    window.cktadmob.lastShownTime = new Date();
		    }
	    };

    	window.cktadmob.readyToShow = function() {
		    result = (window.cktadmob.adStatus == 'loaded' && ((new Date() - window.cktadmob.lastShownTime) / (1000 * 60) > 5));
			return result;
	    }

	    document.addEventListener(window.cktadmob.events.onAdFailedToLoad, function(event) {
		    console.log(event)
    	});

    	document.addEventListener(window.cktadmob.events.onAdLoaded, function(event) {
	    	console.log(event);
		    window.cktadmob.adStatus = 'loaded';
    		window.cktadmob.lastReceivedTime = new Date();
	    	console.log('Request Took ',Math.round(window.cktadmob.lastReceivedTime - window.cktadmob.lastRequestTime) / (1000),' seconds');
	    });

    	document.addEventListener(window.cktadmob.events.onAdOpened, function(event) {
	    	console.log(event)
	    });

    	document.addEventListener(window.cktadmob.events.onAdStarted, function(event) {
	    	console.log(event)
    	});

    	document.addEventListener(window.cktadmob.events.onAdClosed, function(event) {
	    	console.log(event);
		    window.cktadmob.lastClosedTime = new Date();
    		window.cktadmob.adStatus = 'closed';
	    	window.cktadmob.GetAnAdReady();
			if (window.cktadmob.followUp) { window.cktadmob.followUp() };
	    });

    };

    window.onload = function() {
	    if (!adMobConfigured) {
		    configAdMob();
	    }
    };

}