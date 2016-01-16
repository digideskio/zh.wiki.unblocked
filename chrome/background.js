chrome.browserAction.onClicked.addListener(function() {
	chrome.tabs.create({
		'url' : "https://wikipedia.org"
	});
});

chrome.webRequest.onBeforeRequest.addListener(function(details) {
	return {
		redirectUrl : details.url.replace("zh.wikipedia.org", "wikipedia.org")
	};
}, {
	urls : [ "*://zh.wikipedia.org/*" ]
}, [ "blocking" ]);

chrome.webRequest.onBeforeSendHeaders.addListener(function(details) {
	var headers = details.requestHeaders;
	headers.push({
		name : 'Host',
		value : 'zh.wikipedia.org'
	});
	return {
		requestHeaders : headers
	};
}, {
	urls : [ "*://wikipedia.org/*" ]
}, [ 'requestHeaders', 'blocking' ]);
