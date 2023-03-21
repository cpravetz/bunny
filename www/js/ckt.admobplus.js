'use strict'

if (this._cordovaNative) {

    var admobOptions = {};
    var adMobConfigured = false;

    if (/(android)/i.test(navigator.userAgent)) {  // for android & amazon-fireos
	    admobOptions = {
		    appId: "ca-app-pub-7124522495709382/7009797687",
		    bannerAdId: 'ca-app-pub-3940256099942544/6300978111',
            //interstitialAdId: 'ca-app-pub-3940256099942544/1033173712', //test
		    interstitialAdId: 'ca-app-pub-7124522495709382/3512522955', //real
            rewardedAdId: "",
            rewardedInterstitialAdId: "",
            nativeAdId: "",
		    appOpenAdId: "",
		    isTesting: true	    }
    } else if (/(ipod|iphone|ipad)/i.test(navigator.userAgent)) {  // for ios
	    admobOptions = {
		    appId: "ca-app-pub-7124522495709382~7061751694",
		    bannerAdId: 'ca-app-pub-7124522495709382/8573589975',
		    //interstitialAdId: 'ca-app-pub-3940256099942544/4411468910',  //test
		    interstitialAdId: 'ca-app-pub-7124522495709382/4435588359', //real
            rewardedAdId: "",
            rewardedInterstitialAdId: "",
            nativeAdId: "",
		    appOpenAdId: "",
		    isTesting: true
	    }
    }


    const cktadmob = {
        lastRequestTime : 0,
        lastShownTime : 0,
        adStatus : "uninitialized",

        initialize() {
            document.addEventListener(
                'deviceready',
                this.onDeviceReady.bind(this),
                false,
            );

            document.addEventListener(
                'admob.ad.load',
                (evt) => {
                    const { ad } = evt
                    console.log('admob.ad.load', ad.id, ad instanceof admob.AppOpenAd)
                },
                false,
            );

            document.addEventListener(
                'admob.ad.dismiss',
                (evt) => {
                    console.log('admob.ad.dismiss', evt.ad.id)
                },
                false,
            );

            document.addEventListener(
                'admob.ad.show',
                (evt) => {
                    console.log('admob.ad.show', Object.keys(evt))
                },
                false,
            );
            this.adStatus = "initialized";
        },

        thisSucceeded(t, s) {
	        console.log(t+' succeeded');
	        this.adStatus = s;
        },


        onDeviceReady() {
            if (cordova.platformId === 'ios') {
                admob.requestTrackingAuthorization().then(console.log)
            }

           /* admob
                .start()
                .then(() => admob.configure({
                    maxAdContentRating: 'G',
                    tagForChildDirectedTreatment: true,
                    tagForUnderAgeOfConsent: true,
                    testDeviceIds: ['33BE2250B43518CCDA7DE426D04EE231'],
                }))
                .then(() =>
                    admob.BannerAd.config({
                        backgroundColor: '#A7A7A7',
                        marginTop: 10,
                        marginBottom: 10,
                    }),
                )
                .catch(alert);*/
            window.cktadmob = this;
        },

        showBannerAd() {
            const banner = new admob.BannerAd({
                adUnitId: admobOptions.bannerAdId,
            });
            const unsubscribe = banner.on('load', ({ ad }) => {
                console.log('banner loaded', ad.id)
            });
            setTimeout(() => {
                console.log("unsubscribe banner event");
                unsubscribe()
            }, 60 * 1000)
            return banner.show()
        },

        showBannerAdOffset() {
            const banner = new admob.BannerAd({
                adUnitId: admobOptions.bannerAdId,
                offset: 0,
            })
            return banner.show()
        },

        showBannerAdTop() {
            const banner = new admob.BannerAd({
                adUnitId: admobOptions.bannerAdId,
                position: 'top',
            })
            return banner.show()
        },

        showBannerAdAdaptive() {
            const banner = new admob.BannerAd({
                adUnitId: admobOptions.bannerAdId,
                size: {
                    adaptive: "anchored"
                }
            })
            return banner.show()
        },

        showBannerAdAdaptiveInline() {
            const banner = new admob.BannerAd({
                adUnitId: admobOptions.bannerAdId,
                size: {
                    adaptive: "inline",
                    maxHeight: 150,
                }
            })
            return banner.show()
        },

        showInterstitialAd() {
            const interstitial = new admob.InterstitialAd({
                adUnitId: admobOptions.interstitialAdId,
            })
            interstitial.on('dismiss', () => {
                console.log("interstitial dismissed")
                window.cktadmob.lastRequestTime = Date.now()
            })
            return interstitial.load().then(() => interstitial.show()).then(() => {
                setTimeout(() => {
                    interstitial.load().then(() => interstitial.show())
                }, 5000)
            })
        },

        showRewardedAd() {
            const rewarded = new admob.RewardedAd({
                adUnitId: admobOptions.rewardedAdId,
            })
            rewarded.on('dismiss', () => {
                window.cktadmob.lastRequestTime = Date.now()
            })
            return rewarded.load().then(() => rewarded.show())
        },

        showRewardedInterstitialAd() {
            const rewardedInterstitial = new admob.RewardedInterstitialAd({
                adUnitId: admobOptions.rewardedInterstitialAdId,
            })
            rewardedInterstitial.on('dismiss', () => {
                window.cktadmob.lastRequestTime = Date.now()
            })
            return rewardedInterstitial.load().then(() => rewardedInterstitial.show())
        },

        showNativeAd() {
            const ad = new admob.NativeAd({
                adUnitId: 'ca-app-pub-3940256099942544/3986624511',
            })

            return ad
                .load()
                .then(() =>
                    ad.show({
                        x: 0,
                        y: 30,
                        width: window.screen.width,
                        height: 300,
                    }),
                )
                .then(() =>
                    new Promise((resolve) =>
                        setTimeout(() => {
                            ad.hide()
                            resolve()
                        }, 5000),
                    ),
                )
                .then(() => ad.showWith(document.getElementById('native-ad')))
        },

    	GetAnAdReady() {
            if (this.adStatus != 'requested' && this.adStatus != 'requesting' && this.adStatus != 'loaded') {
				console.log('Ad requested');
				this.lastRequestTime = new Date();
				this.adStatus = 'requesting';
                this.interstitial = new admob.InterstitialAd({
                    adUnitId: admobOptions.interstitialAdId,
                });
                this.interstitial.on('dismiss', () => {
                    console.log("interstitial dismissed")
                    this.lastRequestTime = Date.now()
                });
                this.interstitial.on('load', (evt) => {
                    this.thisSucceeded('Request','loaded');
                  })

                return this.interstitial.load();
			}
	    },

    	ShowAnAd(followUp) {
	    	if (this.adStatus == 'loaded') {
				this.adStatus = 'shown';
				this.followUp = followUp;
			    this.lastShownTime = new Date();
				this.interstitial.show().then(()=> {if (followUp) { followUp() }});
		    }
	    },

    	readyToShow() {
		    return (this.adStatus == 'loaded' && ((new Date() - this.lastShownTime) / (1000 * 60) > 5));
	    }

    }

    cktadmob.initialize();

}