var abbrev = true

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

function abbreviateNumber(n) {
	n = parseFloat(n)
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

function addCommas(input) {
	//Add Commas every third entry
	return parseInt(input).toLocaleString("en-US");
}


function timeSinceSale(saleTimestamp) {
  const now = new Date();
  const saleDate = new Date(saleTimestamp * 1000);
  const secondsDiff = Math.floor((now - saleDate) / 1000);
  if (secondsDiff < 60) {
    return `${secondsDiff} second${secondsDiff === 1 ? '' : 's'} ago`;
  } else if (secondsDiff < 3600) {
    const mins = Math.floor(secondsDiff / 60);
    return `${mins} minute${mins === 1 ? '' : 's'} ago`;
  } else if (secondsDiff < 86400) {
    const hours = Math.floor(secondsDiff / 3600);
    return `${hours} hour${hours === 1 ? '' : 's'} ago`;
  } else {
    const days = Math.floor(secondsDiff / 86400);
    return `${days} day${days === 1 ? '' : 's'} ago`;
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
  } else {
	const item = data.items[id];

	return item;
  }
  
  return [0, "", 0, 0, -1, -1, -1, -1, -1, -1, -1, -1]
  //console.log(data)
}

function loadRecentSales(id) {

// Nachricht an das Hintergrundskript senden
chrome.runtime.sendMessage({msgid: "LOAD_RECENT_SALES", itemid: id});

	
}

function loadItemValue(id) {
	chrome.runtime.sendMessage({msgid: "LOAD_ITEM_VALUE", itemid: id});
}

function loadItemRap(id) {

// Nachricht an das Hintergrundskript senden
chrome.runtime.sendMessage({msgid: "LOAD_ITEM_RAP", itemid: id});

	
}

function addValue(valuee) {
	const myElement = document.getElementById('item-container');
	const id = myElement.getAttribute('data-item-id');
	console.log(id);
	// Create an element containing the number
	//const oldElement = document.querySelector("#item-details > div:nth-child(4)")
	//const newElement = oldElement.cloneNode(true);
	//newElement.textContent = "Value: " + findJsonItem(id);
	var item = findJsonItem(id)
	var value = item[3]
	var rap = item[2]
	var acronym = item[1]
	var rare = item[9]
	
	loadRecentSales(id)
	loadItemRap(id)
	
	if (value == -1){
		value = rap
	}
	if (acronym != ""){
		document.querySelector("#item-container > div.remove-panel.section-content.top-section > div.border-bottom.item-name-container > h1").textContent += " ("+acronym+")" 
	}
	if (rare != -1){
		// ✰
		document.querySelector("#item-container > div.remove-panel.section-content.top-section > div.border-bottom.item-name-container > h1").style.color = "red"
		document.querySelector("#item-container > div.remove-panel.section-content.top-section > div.border-bottom.item-name-container > h1").textContent = "✰ " + document.querySelector("#item-container > div.remove-panel.section-content.top-section > div.border-bottom.item-name-container > h1").textContent + " ✰"
	}
	
	waitForElement("#item-info-container-frontend > div > div.item-details-section > div.price-row-container > div > div > div.price-info.row-content > div.item-price-value.icon-text-wrapper.clearfix.icon-robux-price-container > span.text-robux-lg", (priceelem) => {
		priceelem.textContent = abbreviateNumber(document.querySelector("#item-container").getAttribute('data-expected-price'))
	})
	//abbreviateNumber(document.querySelector("#item-container").getAttribute('data-expected-price'))
	//newElement.querySelector("div.field-content > a").setAttribute('href', 'https://www.rolimons.com/item/'+id)
	//newElement.querySelector("div.field-content > a").textContent = "♕ "+abbreviateNumber(value)+" (by Rolimons)"
	//newElement.querySelector("div.field-content > a").style.color = "#b5aa57"
	//newElement.querySelector("div.font-header-1.text-subheader.text-label.text-overflow.field-label").textContent = "Value:"

	// Add the element to the webpage
	//document.querySelector("#item-details > div.clearfix.toggle-target.item-field-container").appendChild(newElement);
	var valuehtml = '<div class="clearfix item-info-row-container"><div class="font-header-1 text-subheader text-label text-overflow row-label">Value</div><span id="type-content" class="font-body text wait-for-i18n-format-render" style="color: rgb(255, 255, 255);">'+"♕ "+abbreviateNumber(valuee)+""+'</span></div>'
	waitForElement('#item-info-container-frontend > div > div.item-details-section > div.clearfix.toggle-target.item-info-row-container', (container) => {
		container.insertAdjacentHTML('afterend', valuehtml);
	})
	waitForElement('#item-info-container-frontend > div > div.item-details-section > div:nth-child(5) > div', (valtext) => {
		valtext.style.color = "#b5aa57"
	})
	
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  
  if (request.msgid === "ITEM_DATA") {
	  console.log(request.data)
	  //addValue(request.data)
  }

if (request.msgid === "RECENT_SALES") {
    //console.log("Recent Sales: " + request.data);
	
	var salehtml = '';
	
	for (let sales of JSON.parse(request.data)) {
				console.log(sales)
				salehtml += '<div class="sales-grid-item">'+addCommas(sales.Price)+'<br>Robux<br><div class="rbx-divider"></div>'
				salehtml += '<p>'+timeSinceSale(sales.Timest)+'</p></div>'
	}
			
	if (salehtml === '') { salehtml =  '<div class="sales-grid-item">No Sales<br>since logging</div>' }
	
	waitForElement('#container-main > div.content', (container) => {

		waitForElementOrSkip('#SalesDisplay', (ad) => {
			ad.remove();
		})
		waitForElementOrSkip('#Leaderboard-Abp', (ad) => {
			ad.remove();
		})
		
		container.insertAdjacentHTML('afterbegin', '<div id="SalesDisplay" class="sales-container"></div>');
		
		waitForElement('#SalesDisplay', (ad) => {
			// html body#rbx-body.rbx-body.dark-theme.gotham-font div#wrap.wrap.no-gutter-ads.logged-in main#container-main.container-main div.content div#Skyscraper-Abp-Right.abp.abp-container.right-abp
			
			ad.innerHTML = `
			<head>
				<h2>Recent Sales</h2>
				<div class="rbx-divider"></div>
				<link rel="stylesheet" href="css/styles.css">
			</head>
			<body>
				<div class="sales-grid-container">`
					+salehtml+	
				`</div>
			</body>`
		})
		
	})
  }
  
  if (request.msgid === "ITEM_RAP") {
	waitForElement('#price-chart > asset-resale-data-pane > div.section-content.price-volume-charts-container > div.clearfix > div:nth-child(3)', (avgprice) => {
			// html body#rbx-body.rbx-body.dark-theme.gotham-font div#wrap.wrap.no-gutter-ads.logged-in main#container-main.container-main div.content div#Skyscraper-Abp-Right.abp.abp-container.right-abp
		const jdata = JSON.parse(request.data)
		
		const rootpart = document.querySelector("#price-chart > asset-resale-data-pane > div.section-content.price-volume-charts-container > div.clearfix")
		
		const avgWeekPrice = jdata[0].RapWeek || 0
		const avgWeekElem = avgprice.cloneNode(true);
		rootpart.appendChild(avgWeekElem)
		const avgMonthPrice = jdata[0].RapMonth || 0
		const avgMonthElem = avgprice.cloneNode(true);
		rootpart.appendChild(avgMonthElem)
		const avgYearPrice = jdata[0].RapYear || 0
		const avgYearElem = avgprice.cloneNode(true);
		rootpart.appendChild(avgYearElem)
		avgWeekElem.innerHTML = '<div class="text-label ng-binding">'+'AVG Price (Last 7 Days)'+'</div> <div id="item-original-price" class="info-content"> <span class="icon-robux-20x20"></span> <span id="item-average-price" class="text-robux ng-binding">'+abbreviateNumber(avgWeekPrice)+'</span>'
		avgMonthElem.innerHTML = '<div class="text-label ng-binding">'+'AVG Price (Last 30 Days)'+'</div> <div id="item-original-price" class="info-content"> <span class="icon-robux-20x20"></span> <span id="item-average-price" class="text-robux ng-binding">'+abbreviateNumber(avgMonthPrice)+'</span>'
		avgYearElem.innerHTML = '<div class="text-label ng-binding">'+'AVG Price (Last 365 Days)'+'</div> <div id="item-original-price" class="info-content"> <span class="icon-robux-20x20"></span> <span id="item-average-price" class="text-robux ng-binding">'+abbreviateNumber(avgYearPrice)+'</span>'
	})
  }
  
  if (request.msgid === "ITEM_VALUE") {
	  const jdata = JSON.parse(request.data)
	  const value = jdata[0].Value || 0
	  addValue(value)
  }

})
const myElement2 = document.getElementById('item-container');
const iid = myElement2.getAttribute('data-item-id');
loadItemValue(iid)
//addValue()