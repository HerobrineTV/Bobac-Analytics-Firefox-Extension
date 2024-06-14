let newTotal = null;
var valueup = 0;
var valuedown = 0;
var lasttradelink = "";
var newtradelink = "";
var tradecount = 0;
var abbrev = true

function addCommas(input) {
	//Add Commas every third entry
	return parseInt(input).toLocaleString("en-US");
}

function abbreviateNumber(n) {
	if (abbrev == true){
		if (n < 1e3) return +n.toFixed(2)+"";
		if (n >= 1e3 && n < 1e6) return +(n / 1e3).toFixed(1) + "K";
		if (n >= 1e6 && n < 1e9) return +(n / 1e6).toFixed(1) + "M";
		if (n >= 1e9 && n < 1e12) return +(n / 1e9).toFixed(1) + "B";
		if (n >= 1e12) return +(n / 1e12).toFixed(1) + "T";  
	} else {
		return n;
	}
}

let itemData = null;

function updateItemData() {
  chrome.storage.local.get('apiData', function(data) {
    itemData = data.apiData;
    //console.log('Retrieved item data:', itemData);
  });
}


function findJsonItem(id) {

  updateItemData()

  // Search for the JSON item that matches the URL part
  const data = JSON.parse(itemData);
  if (itemData === null || itemData === undefined) {
	  console.log("Error")
	  //updateItemData();
  }
  //console.log(data)
  const item = data.items[id];

  return item;
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {

  function waitForElement(selector, callback) {
    const element = document.querySelector(selector);
    if (element) {
      callback(element);
    } else {
      setTimeout(() => {
        waitForElement(selector, callback);
      }, 100);
    }
  }
  
  function waitForElementOrSkip(selector, callback) {
    const element = document.querySelector(selector);
    if (element) {
      callback(element);
    } else {
      console.log(`Element with selector "${selector}" not found. Skipping callback.`);
    }
  }
  if(request.message.msgid === "tradeitem") {
	  
  waitForElement(`[data-userassetid="${request.message.uaid}"]`, (element) => {
    var item = findJsonItem(request.message.assetid);
    const userAssetId = request.message.uaid;
    const robux = request.message.robux;
    var value = item[4];
    const newElement = element.querySelector("div.item-card-caption > div > span.text-robux.ng-binding").cloneNode(true);
    newElement.textContent = "♕ " + addCommas(value);
    newElement.style.color = "#b5aa57";
    element.appendChild(newElement);
    
    if (request.message.first == true) {
      if (request.message.playernum == 1) {
        waitForElement("#trades-container > div > div.ng-scope > div > div > div.col-xs-12.col-sm-8.trades-list-detail > div > div.col-xs-12 > div:nth-child(1) > div:nth-child(4) > div:nth-child(2) > span.robux-line-amount", (totalElement) => {
          newTotal = totalElement.cloneNode(true);
          totalElement.parentNode.appendChild(newTotal);
          newTotal.querySelector("span.text-robux-lg.robux-line-value.ng-binding").style.color = "#b5aa57";
          newTotal.querySelector("span.text-robux-lg.robux-line-value.ng-binding").textContent = value + robux;
        });
      } else {
        waitForElement("#trades-container > div > div.ng-scope > div > div > div.col-xs-12.col-sm-8.trades-list-detail > div > div.col-xs-12 > div:nth-child(2) > div:nth-child(4) > div:nth-child(2) > span.robux-line-amount", (totalElement) => {
          valueup = parseInt(newTotal.querySelector("span.text-robux-lg.robux-line-value.ng-binding").textContent);
		  newTotal.querySelector("span.text-robux-lg.robux-line-value.ng-binding").textContent = "♕ " + addCommas(newTotal.querySelector("span.text-robux-lg.robux-line-value.ng-binding").textContent)
		  newTotal.querySelector("span.icon-robux-16x16").remove()
		  newTotal = totalElement.cloneNode(true);
          totalElement.parentNode.appendChild(newTotal);
          newTotal.querySelector("span.text-robux-lg.robux-line-value.ng-binding").style.color = "#b5aa57";
          newTotal.querySelector("span.text-robux-lg.robux-line-value.ng-binding").textContent = value + robux
		  newTotal.querySelector("span.icon-robux-16x16").remove()
		});
      }
	    newTotal.querySelector("span.text-robux-lg.robux-line-value.ng-binding").style.color = "#b5aa57"
		newTotal.querySelector("span.text-robux-lg.robux-line-value.ng-binding").textContent = value + robux
		valuedown = parseInt(newTotal.querySelector("span.text-robux-lg.robux-line-value.ng-binding").textContent)
	  
    } else {
		newTotal.querySelector("span.text-robux-lg.robux-line-value.ng-binding").textContent = parseInt(newTotal.querySelector("span.text-robux-lg.robux-line-value.ng-binding").textContent) + value 
  	if (request.message.playernum == 2) {
		valuedown = parseInt(newTotal.querySelector("span.text-robux-lg.robux-line-value.ng-binding").textContent)
	}
	}
	if (request.message.lastitem == true) {
		let percentage = (((valuedown - valueup)/ valueup) * 100)
		console.log(valuedown, valueup, ((valuedown - valueup)/ valueup) * 100)
		newTotal.querySelector("span.text-robux-lg.robux-line-value.ng-binding").textContent = "♕ " + addCommas(newTotal.querySelector("span.text-robux-lg.robux-line-value.ng-binding").textContent)
		document.querySelector("#trades-container > div > div.ng-scope > div > div > div.col-xs-12.col-sm-8.trades-list-detail > div > div.col-xs-12 > div:nth-child(1) > h3").textContent += " (Values Powered by Rolimons)"
		waitForElement("#trades-container > div > div.ng-scope > div > div > div.col-xs-12.col-sm-8.trades-list-detail > div > div.col-xs-12 > div:nth-child(2) > div:nth-child(1)", (oldLine) => {
			//const newLine = oldLine.cloneNode(true);
			//oldLine.parentNode.appendChild(newLine)
			var color = "#ff0000"
			//var htext = addCommas(percentage.toFixed(2)) + "%"
			var htext = percentage.toFixed(2) + "%"
			if (percentage > 0) {
				color = "#339966"
				htext = "+"+htext
			} else if (percentage === 0) {
				color = "#ffffff"
			}
			oldLine.insertAdjacentHTML("afterend", '<h2 style="text-align: center;"><span style="color: '+color+';">'+htext+'</h2><div class="rbx-divider"></div>')
		})
		//const oldLine = document.querySelector("#trades-container > div > div.ng-scope > div > div > div.col-xs-12.col-sm-8.trades-list-detail > div > div.col-xs-12 > div:nth-child(2) > div:nth-child(1)")
	}
	});  
  } else if (request.message.msgid === "tradelist") {
	  console.log(request.message.json)
	  const firsttrade = true
	  
	  if (lasttradelink != request.message.tlink){
		  //waitForElement("#trade-row-scroll-container > div.simplebar-wrapper > div.simplebar-mask > div > div > div > div.trade-row.ng-scope.selected", (tradeview) => {
			firsstrade = true
			 lasttradelink = request.message.tlink
		  //})
	  }
	  let giveval = 0;
	  let getval = 0;
	  
	  const data = JSON.parse(request.message.json);
	  var player = 0
	  for (let offer of data.offers) {
		  var first = true
					if (offer.user && offer.userAssets) { 
						player += 1
						for (let userAsset of offer.userAssets) {
							if (player === 1) {
								var item = findJsonItem(userAsset.assetId);
								giveval += item[4] //Adding Value
								if (first == true) {
									giveval += offer.robux
									first = false
								}
							} else if (player === 2) {
								var item = findJsonItem(userAsset.assetId);
								getval += item[4]
								if (first == true) {
									getval += offer.robux
									first = false
								}
							}

						}
					}
				}
				
		console.log(getval, giveval, ((getval - giveval)/ giveval) * 100)
	  
	  let percentage = (((getval - giveval)/ giveval) * 100)
	  var color = "#ff0000"
	  var htext = percentage.toFixed(2) + "%" + " [" + giveval + " | " +getval + "] [GIVE|GET]"
	  if (percentage > 0) {
		color = "#339966"
		htext = "+"+htext
	  } else if (percentage === 0) {
		color = "#ffffff"
	  }
	  
	  if (firsstrade == true) {
		  waitForElement("#trade-row-scroll-container > div.simplebar-wrapper > div.simplebar-mask > div > div > div > div.trade-row.ng-scope.selected > div.trade-row-container", (tradeview) => {
			  tradecount = 1
			  
			  tradeview.insertAdjacentHTML("afterend", '<p style="text-align: center;"><span style="color: '+color+';">'+htext+'</p>')
			  
		  })
		  firsstrade = false
	  } else {
		  tradecount += 1
		  waitForElement("#trade-row-scroll-container > div.simplebar-wrapper > div.simplebar-mask > div > div > div > div:nth-child("+tradecount+") > div.trade-row-container", (tradeview) => {
			  tradeview.insertAdjacentHTML("afterend", '<p style="text-align: center;"><span style="color: '+color+';">'+htext+'</p>')
		  })
	  }
	  
	  
	  // document.querySelector("#trade-row-scroll-container > div.simplebar-wrapper > div.simplebar-mask > div > div > div > div:nth-child(2) > div.trade-row-container")
	  
	  // document.querySelector("#trade-row-scroll-container > div.simplebar-wrapper > div.simplebar-mask > div > div > div > div.trade-row.ng-scope.selected")
	  
	  // document.querySelector("#trade-row-scroll-container > div.simplebar-wrapper > div.simplebar-mask > div > div > div > div:nth-child(2)")
	  // document.querySelector("#trade-row-scroll-container > div.simplebar-wrapper > div.simplebar-mask > div > div > div > div:nth-child(3)")
  }

})

updateItemData()