function addPlayerTags() {
	function waitForElementOrSkip(selector, callback) {
		const element = document.querySelector(selector);
		if (element) {
			callback(element);
		} else {
			console.log(`Element with selector "${selector}" not found. Skipping callback.`);
		}
	}
	
	waitForElementOrSkip("#container-main > div.content > div.profile-container.ng-scope > div > div.section.profile-header > div > div.hidden.ng-isolate-scope", (userid) => {
		if (userid.getAttribute('data-profileuserid') == 2533508829 || userid.getAttribute('data-profileuserid') == 221028198){
			document.querySelector("#container-main > div.content > div.profile-container.ng-scope > div > div.section.profile-header > div > div.profile-header-top > div.header-caption > div.header-names > div.header-title > h1:nth-child(1)").style.color = "#b5aa57"
			document.querySelector("#container-main > div.content > div.profile-container.ng-scope > div > div.section.profile-header > div > div.profile-header-top > div.header-caption > div.header-names > div.header-title > h1:nth-child(1)").textContent = "♕ " + document.querySelector("#container-main > div.content > div.profile-container.ng-scope > div > div.section.profile-header > div > div.profile-header-top > div.header-caption > div.header-names > div.header-title > h1:nth-child(1)").textContent + " ♕"
		}
	})
}

addPlayerTags()