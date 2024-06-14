// create a new port
//let tradeport = chrome.runtime.connect({name: "tradePort"});
const URL = ["https://trades.roblox.com/v1/trades/*"];
const TRADEURL = ["https://trades.roblox.com/v1/trades/"]

let lasttradelink = "";
let tradesloaded = 0
let requestBeingProcessed = false;
//setTimeout(() => {}, 1000);

function sendToContent(message) {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    if (tabs && tabs.length > 0) {
      chrome.tabs.sendMessage(tabs[0].id, {message: message});
    } else {
      console.error("No active tabs found.");
    }
  });
}


function getApiData() {
  chrome.storage.local.get('apiData', function (data) {
    const lastUpdate = data.lastUpdate;
    const now = new Date().getTime();
    if (!lastUpdate || (now - lastUpdate > 60000)) { // check if last update was more than 1 minute ago
		var xhr = new XMLHttpRequest();
		xhr.open('GET', 'https://www.rolimons.com/itemapi/itemdetails', true);
		xhr.responseType = 'json';
		xhr.setRequestHeader('Content-Type', 'application/json');
		xhr.setRequestHeader('Accept', 'application/json');
		xhr.mode = 'cors';
		xhr.onload = function() {
			if (xhr.readyState === 4 && xhr.status === 200) {
				const apiData = JSON.stringify(xhr.response);
				chrome.storage.local.set({ apiData: apiData, lastUpdate: now });
				console.log("Saved " + apiData)
			}
		};
		xhr.onerror = function() {
			console.log('Error making request');
		};
		xhr.send();

//		const xhr = new XMLHttpRequest();
//		xhr.open('GET', 'https://www.rolimons.com/itemapi/itemdetails', true);
//		xhr.onreadystatechange = function () {
//		if (xhr.readyState === 4 && xhr.status === 200) {
 //         const apiData = xhr.responseText;
 //         chrome.storage.local.set({ apiData: apiData, lastUpdate: now });
 //       }
      };
 //     xhr.send();
 //   }
  });
}

function loadRecentSales(itemid) {
  const apilink = 'https://api.bobac-analytics.com/ba/recentsales/'+itemid

  var xhr = new XMLHttpRequest();
  xhr.open('GET', apilink, true);
  xhr.responseType = 'json';
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.setRequestHeader('Accept', 'application/json');
  xhr.mode = 'cors';
  xhr.onload = function() {
    if (xhr.readyState === 4 && xhr.status === 200) {
      const apiData = JSON.stringify(xhr.response);
      //console.log("Recent Sales: " + apiData);
	  const message = {
		  msgid: "RECENT_SALES",
		  data: apiData
	  }
      // Antwort an das Inhalts-Skript senden
      chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, message);
      });
    }
  };
  xhr.onerror = function(err) {
    console.log('Error making request', err);
  };
  xhr.send();
}

function loadItemValue (itemid) {
  const apilink = 'https://api.bobac-analytics.com/ba/getvalue/'+itemid

  var xhr = new XMLHttpRequest();
  xhr.open('GET', apilink, true);
  xhr.responseType = 'json';
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.setRequestHeader('Accept', 'application/json');
  xhr.mode = 'cors';
  xhr.onload = function() {
    if (xhr.readyState === 4 && xhr.status === 200) {
      const apiData = JSON.stringify(xhr.response);
      //console.log("Recent Sales: " + apiData);
	  const message = {
		  msgid: "ITEM_VALUE",
		  data: apiData
	  }
      // Antwort an das Inhalts-Skript senden
      chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, message);
      });
    }
  };
  xhr.onerror = function(err) {
    console.log('Error making request', err);
  };
  xhr.send();
}

function loadItemRap (itemid) {
  const apilink = 'https://api.bobac-analytics.com/ba/getrap/'+itemid

  var xhr = new XMLHttpRequest();
  xhr.open('GET', apilink, true);
  xhr.responseType = 'json';
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.setRequestHeader('Accept', 'application/json');
  xhr.mode = 'cors';
  xhr.onload = function() {
    if (xhr.readyState === 4 && xhr.status === 200) {
      const apiData = JSON.stringify(xhr.response);
      //console.log("Recent Sales: " + apiData);
	  const message = {
		  msgid: "ITEM_RAP",
		  data: apiData
	  }
      // Antwort an das Inhalts-Skript senden
      chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, message);
      });
    }
  };
  xhr.onerror = function(err) {
    console.log('Error making request', err);
  };
  xhr.send();
}

// Nachricht von der Erweiterung empfangen
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  if (message.msgid === "LOAD_RECENT_SALES") {
    loadRecentSales(message.itemid);
  }
  if (message.msgid === "LOAD_ITEM_RAP") {
	loadItemRap(message.itemid)
  }
  if (message.msgid === "LOAD_ITEM_VALUE") {
	loadItemValue(message.itemid)
  }
});



getApiData()
setInterval(getApiData, 60000);

chrome.webRequest.onCompleted.addListener(
  (details) => {
    //console.log(details.url + ": " + JSON.stringify(details));
  },
  { urls: ["https://trades.roblox.com/v1/trades/*", "https://www.roblox.com/*"] },
  ["responseHeaders"]
);

// Register a listener for network requests
chrome.webRequest.onBeforeRequest.addListener(
	async (details) => {
		//console.log("API call detected: ", details.url);
		var linkurl = details.url
		if (requestBeingProcessed) {
			//console.log("Request already being processed, skipping...");
			return;
		}
		requestBeingProcessed = true;
		try {
			const response = await fetch(details.url);
			const jsonResponse = await response.json();
			//console.log("API response received for ", details.url, ": ", jsonResponse);
			const hasCustomQueryParam = /\?my_extension=true/.test(details.url);
			if (jsonResponse && jsonResponse.offers && !hasCustomQueryParam) {
				//console.log("tes")
				var player = 0;
				var lastItem = false;
				for (let offer of jsonResponse.offers) {
					if (offer.user && offer.userAssets) {
						player += 1;
						var firstv = true;
						let uAlen = offer.userAssets.length;
						var counter = 0;
						for (let userAsset of offer.userAssets) {
							counter+=1;
							let lastItem = false; // declare and set it to false at the beginning of each iteration
							if (player === 2 && uAlen === counter) {
								lastItem = true;
							}
							//console.log(counter, uAlen, lastItem)
							const message = {
								assetid: userAsset.assetId,
								uaid: userAsset.id,
								msgid: "tradeitem",
								userid: offer.user.id,
								first: firstv,
								robux: offer.robux,
								playernum: player,
								lastitem: lastItem 
							};
							firstv = false;
							sendToContent(message);
						}
					}
				}
	/*		} else if (jsonResponse && jsonResponse.data) {
				var newtradelink = details.url;
				(async () => {
					for (let trade of jsonResponse.data) {
						console.log(trade.id);
						var xhr = new XMLHttpRequest();
						const tradeUrl = TRADEURL + trade.id + '?my_extension=true';
						xhr.open('GET', tradeUrl, true);
						xhr.responseType = 'json';
						xhr.setRequestHeader('Content-Type', 'application/json');
						xhr.setRequestHeader('Accept', 'application/json');
						xhr.mode = 'cors';
						xhr.onload = function() {
							if (xhr.readyState === 4 && xhr.status === 200) {
								const apiData = JSON.stringify(xhr.response);
								//console.log("Trade: " + tradeUrl)
								const message = {
									json: apiData,
									msgid: "tradelist",
									tlink: lasttradelink
								};
								sendToContent(message);
							}
						};
						//console.log(tradeUrl)
						xhr.onerror = function() {
							console.log('Error making request');
						};
						xhr.send();
						await new Promise(resolve => setTimeout(resolve, 1000)); // wait for 1 second before making the next request	
						tradesloaded += 1
						if (tradesloaded >= 20) {
							await new Promise(resolve => setTimeout(resolve, 30000)); // wait for 1 second before making the next request	
							tradesloaded = 0
						}
						if (lasttradelink != newtradelink) {
							lasttradelink = newtradelink
							break;
						}
					}
				})(); 
			} else if (linkurl ==="https://trades.roblox.com/v1/trades/inbound/count") {
				// https://trades.roblox.com/v1/trades/inbound?cursor=&limit=25&sortOrder=Desc
				var xhr = new XMLHttpRequest();
				xhr.open('GET', "https://trades.roblox.com/v1/trades/inbound?cursor=&limit=25&sortOrder=Desc", true);
				xhr.responseType = 'json';
				xhr.setRequestHeader('Content-Type', 'application/json');
				xhr.setRequestHeader('Accept', 'application/json');
				xhr.mode = 'cors';
				xhr.onload = function() {
					if (xhr.readyState === 4 && xhr.status === 200) {
						console.log("Loading inbounds...")
					}
				};
						//console.log(tradeUrl)
				xhr.onerror = function() {
					console.log('Error making request');
				};
				xhr.send(); */
			}
		} catch (error) {
			console.error("API call failed: ", error);
		}
		requestBeingProcessed = false;
	},
	{ urls: URL },
	["blocking"]
);

// listen for messages from the port
//tradeport.onMessage.addListener(function(msg) {
//  console.log("Message received from content.js: " + msg.message);
//});
