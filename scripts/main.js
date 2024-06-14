function reworkRobux(){
	
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
	
	waitForElement("#nav-robux-amount", (element) => {
		element.style.color = "#b5aa57";
	})
}

reworkRobux()