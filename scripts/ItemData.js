
let itemData = null;

function updateItemData() {
  chrome.storage.local.get('apiData', function(data) {
    itemData = data.apiData;
    //console.log('Retrieved item data:', itemData);
  });
}

updateItemData(); // Call it once on startup
setInterval(updateItemData, 60 * 1000); // Call it every minute