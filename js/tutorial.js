var controlButtons = document.getElementsByClassName('control-btn');
for (var i = 0; i < controlButtons.length; i++) {
	var btn = controlButtons[i];
	btn.addEventListener("click", function() {
		appAction(this);
	});
}

var infoLinks = document.getElementsByClassName('info');
for (var i = 0; i < infoLinks.length; i++) {
	var link = infoLinks[i];
	link.addEventListener("click", function() {
		appInfo(this);
	});
}

function appAction(element) {
	var statusElement = element.parentElement.previousElementSibling.previousElementSibling.previousElementSibling;
	var currentStatus = statusElement.textContent;
	if (currentStatus === 'Stopped') {
		statusElement.innerHTML = 'Running';
		statusElement.style.color = 'green';
		element.innerHTML = 'Stop';
	} else if (currentStatus === 'Running') {
		statusElement.innerHTML = 'Stopped';
		statusElement.style.color = 'orange';
		element.innerHTML = 'Start';
	} else if (currentStatus === 'Error') {
		statusElement.innerHTML = 'Error';
		element.style.color = 'gray';
	}
}

function appInfo(element) {
	var nameElement = element.parentElement.previousElementSibling.previousElementSibling.previousElementSibling;
	var statusElement = element.parentElement.previousElementSibling.previousElementSibling;
	alert("Application " + nameElement.innerHTML + " is " + statusElement.innerHTML);
}

