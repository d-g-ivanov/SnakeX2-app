var admobid = null;
var isTesting = false; //change to false when done

if (/(android)/i.test(navigator.userAgent)) {  // for android & amazon-fireos
  admobid = {
    banner: '',
    interstitial: '',
    rewardvideo: '',
  }
}

//ad functions
function prepBanner(e, stopLoader) {
	if(!stopLoader) showAdLoader();
	
	admob.banner.config({
		id: admobid.banner,
		isTesting: isTesting,
		autoShow: true,
	});
	admob.banner.prepare();
}

function prepInterstitial(e, stopLoader) {
	if(!stopLoader) showAdLoader();
	
	admob.interstitial.config({
		id: admobid.interstitial,
		isTesting: isTesting,
		autoShow: true,
	});
	admob.interstitial.prepare();
}

function prepVideo(e, stopLoader) {
	if(!stopLoader) showAdLoader();
	
	admob.rewardvideo.config({
		id: admobid.rewardvideo,
		isTesting: isTesting,
		autoShow: true,
	});
	admob.rewardvideo.prepare();
}

//handle in-game adds
function displayAdsOnScreenChange(screen) {
	if (admob) {
		if ( (screen === 'gameScreen' && event.target.dataset.action === "singlePlayer") || screen === 'gameOver') {
			prepInterstitial(null, 'stop loader'); //stop loader
		}
	}
}

//loader for ads
function showAdLoader() {
	var loader = document.querySelector('.loadingScreen');
	loader.classList.add('active');
	loader.classList.add('adLoader');
}

function removeAdLoader() {
	var loader = document.querySelector('.loadingScreen');
	loader.classList.remove('active');
	setTimeout( function() { loader.classList.remove('adLoader'); }, 100);
}

/* ad events */
//failed to load
document.addEventListener('admob.interstitial.events.LOAD_FAIL', function(event) {
  var currentScreen = document.querySelector('#game .screen.active');
  
  if ( currentScreen.classList.contains('adsScreen') ) {
	removeAdLoader();
	
	if (event.error >= 0) alert('Cannot load ad. Please check whether you are connected to internet and try again.');
	//else alert(JSON.stringify(event, null, 4));
  }
});

//opened
var interstitialCount = 0;
document.addEventListener('admob.interstitial.events.OPEN', function(event) {
	var currentScreen = document.querySelector('#game .screen.active');
  
	if ( currentScreen.classList.contains('adsScreen') ) {
		removeAdLoader();
		interstitialCount++;
		document.querySelector('[data-action="prepInterstitial"]').textContent = 'Thank you. See more? (Ads viewed so far: ' + interstitialCount + ')';
	}
});

// deviceready event
document.addEventListener('deviceready', function() {
	console.log('device is ready');
}, false);





















