
if (window.location.href.includes("roblox.com/trades")) {
  const tradesScript = document.createElement("script");
  tradesScript.src = "scripts/trades.js";
  document.head.appendChild(tradesScript);
 const mainScript = document.createElement("script");
 mainScript.src = "scripts/main.js";
 document.head.appendChild(mainScript);
} else if (window.location.href.includes("roblox.com/catalog")) {
  const catalogScript = document.createElement("script");
  catalogScript.src = "scripts/catalog.js";
  document.head.appendChild(catalogScript);
 const mainScript = document.createElement("script");
 mainScript.src = "scripts/main.js";
 document.head.appendChild(mainScript);
} else if (window.location.href.includes("roblox.com/users")) {
  const usersScript = document.createElement("script");
  usersScript.src = "scripts/users.js";
  document.head.appendChild(usersScript);
 const mainScript = document.createElement("script");
 mainScript.src = "scripts/main.js";
 document.head.appendChild(mainScript);
}
/*
// Create the open button
const openButton = document.createElement("button");
openButton.textContent = "Settings";
openButton.style.position = "fixed";
openButton.style.bottom = "0";
openButton.style.left = "0";
openButton.style.zIndex = "9999";
openButton.href = chrome.extension.getURL('settings.html');
openButton.style.backgroundColor = "black"
document.body.appendChild(openButton);

openButton.addEventListener("click", () => {
	// create a new popup window
	chrome.windows.create({
		'url': 'settings.html', // replace with your settings page URL
		'type': 'popup',
		'width': 400,
		'height': 600
	});
});
*/
