var buttons = require('sdk/ui/button/action');
var tabs = require("sdk/tabs");
var { Cu, Ci } = require('chrome');

var button = buttons.ActionButton({
	id : "zhwiki",
	label : "Visit Chinese Wikipedia",
	icon : {
		"32" : "./icon32.png",
		"128" : "./icon128.png"
	},
	onClick : handleClick
});

function handleClick(state) {
	tabs.open("https://wikipedia.org/");
}

Cu.import('resource://gre/modules/Services.jsm');
var redirectPattern = new RegExp('^(http|https):\/\/zh\.wikipedia\.org\/\.*');
var frontingPattern = new RegExp('^(http|https):\/\/wikipedia\.org\/\.*');
var httpRequestObserver = {	
	observe : function(subject, topic, data) {
		var httpChannel, requestURL;
		if (topic == "http-on-modify-request") {
			httpChannel = subject.QueryInterface(Ci.nsIHttpChannel);
			requestURL = httpChannel.URI.spec;

			if (redirectPattern.test(requestURL)) {
				var newRequestURL = requestURL.replace("zh.wikipedia.org",
						"wikipedia.org")
				httpChannel.redirectTo(Services.io.newURI(newRequestURL, null,
						null));
			} else if (frontingPattern.test(requestURL)) {
				httpChannel.setRequestHeader("Host", "zh.wikipedia.org", false);
			}
			return;
		}
	},
};
Services.obs.addObserver(httpRequestObserver, "http-on-modify-request", false);
